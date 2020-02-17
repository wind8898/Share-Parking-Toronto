import os
from flask_sqlalchemy import SQLAlchemy

from model import *

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from geopy.geocoders import Nominatim

# import library for the web scraping
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
from splinter import Browser
import time
import re

app = Flask(__name__)

DB_URL = 'postgresql://eynjeleywopzpd:faa6c1ed8f60c969b72d838fe60e02cc5e2bb3bfc614b01e5449db9f6c3b1dee@ec2-34-235-108-68.compute-1.amazonaws.com:5432/dcuv8ruasf6mj0'

engine = create_engine(DB_URL, echo=False)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)


@app.route('/form.html')

def form():
    data = "",
    return render_template("form.html", data=data)


@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":

        max_garage_id = db.session.query(db.func.max(ParkingSpot.garage_id)).one()
        next_garage_id = max_garage_id[0] + 1

        cell = request.form["cell"]
        
        cust_check = db.session.query(ParkingSpot.cust_id).filter(ParkingSpot.cell == cell).exists()
        
        #if cust_check:
        #    cust_id = db.session.query(ParkingSpot.cust_id).filter(ParkingSpot.cell == cell).one()
        #    next_cust_id = cust_id[0]
        #else:
        max_cust_id = db.session.query(db.func.max(ParkingSpot.cust_id)).one()
        next_cust_id = max_cust_id[0] + 1


        #  convert the address to lat, lon
        geolocator = Nominatim(user_agent="parking")
        addr = request.form["location"]

        location = geolocator.geocode(addr)
        lat = float(location.latitude)
        lng = float(location.longitude)
        address = location.address
        
        garage_id = next_garage_id
        # address = request.form["location"]
        rate_per_half_hour = request.form["price"] 
        carpark_type_str = "outdoor"
        capacity = "0"
        start_date_time = request.form["startdate"] #+ request.form["starttime"]
        start_date = request.form["startdate"]
        start_time = request.form["starttime"]
        end_date_time = request.form["enddate"] #+ request.form["endtime"]
        end_date = request.form["enddate"]
        end_time = request.form["endtime"]
        duration_type = "short-term"
        parking_type = "public"
        cust_id = next_cust_id
        
        parking_spot = ParkingSpot(garage_id=garage_id, address=address, lat=lat, lng=lng, rate_per_half_hour=rate_per_half_hour,
                                    carpark_type_str=carpark_type_str, capacity=capacity, start_date_time=start_date_time, start_date=start_date, 
                                    start_time=start_time, end_date_time=end_date_time, end_date=end_date, end_time=end_time, 
                                    duration_type=duration_type, parking_type=parking_type,cust_id=cust_id, cell=cell)
        db.session.add(parking_spot)
        db.session.commit()

        # render the data into html for display input location on the map
        data = {
            "lat" : lat,
            "lng" : lng,
            "rate" : rate_per_half_hour
        }

        # Call the scrape_parking_info
        try:
            scrape_parking_info(address)
        except:
            pass

        return render_template("form.html", data=data)

# web data scraping from bestparking.com to obtain the nearby parking spot around the user's input address

# fucntion to clean the string 
def cleanstring(mystring):
    my_regex = "\(.*\)|\s-\s.*"
    result = re.sub(my_regex, ", Toronto", mystring)
    return result

def init_browser():
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=True)

def scrape_parking_info(address):
# open bestparking website and input the enquery address    
    browser = init_browser()
    url = "https://www.bestparking.com/"
    browser.visit(url)
    time.sleep(1)
    browser.find_by_id('home-autocomplete').fill(address)
    time.sleep(1)
    button = browser.find_by_css('.location-suggestion-main-text').first
    button.click()
    time.sleep(1)
    
#   Secure the data from the open search page 
    location_name = browser.find_by_css('.location-name')
    loc_address = browser.find_by_css('.address')
    location_price = browser.find_by_css('.listing-price')
    
    location_name_array = []
    loc_address_array = []
    location_price_array = []
    lat_array = []
    lng_array = []

    geolocator = Nominatim(user_agent="nearby-parking")
    
#   List the 5 parking spaces nearby
    for i in range(5):
        location = geolocator.geocode(cleanstring(loc_address[i].text))
        try:
            lat = float(location.latitude)
            lng = float(location.longitude)
        except:
            pass
        else:
            loc_address_array.append(cleanstring(loc_address[i].text))
            location_name_array.append(location_name[i].text)
            location_price_array.append(location_price[i].text) 
            lat_array.append(lat)
            lng_array.append(lng)
            time.sleep(0.3)
        
    nearby_df = pd.DataFrame(
    {'Location_Name':location_name_array, 
     'Location_Address':loc_address_array, 
     'Location_Price_Hour':location_price_array,
     'lat':lat_array,
     'lng':lng_array
     })

#  Export to sql database   
    nearby_df.to_sql('nearby_parking', con=engine, if_exists='replace', index=False)
    
    return nearby_df

@app.route("/api/get_nearby_spots")
def get_nearby_spots():
    results = db.session.query(NearbyParking.Location_Name, NearbyParking.Location_Address, NearbyParking.Location_Price_Hour, NearbyParking.lat, NearbyParking.lng).all()

    Location_Name = [result[0] for result in results]
    Location_Address = [result[1] for result in results]
    Location_Price_Hour = [result[2] for result in results]
    lat = [result[3] for result in results]
    lng = [result[4] for result in results]

    nearby_parking_data = [
        {
            "Location_Name": Location_Name,
            "Location_Address": Location_Address,
            "Location_Price_Hour" : Location_Price_Hour,
            "lat": lat,
            "lng": lng
        }
    ]

    return jsonify(nearby_parking_data)



@app.route("/api/get_parking_spots")
def get_parking_spots():
    results = db.session.query(ParkingSpot.address, ParkingSpot.rate_per_half_hour, ParkingSpot.lat, ParkingSpot.lng, ParkingSpot.start_date_time, ParkingSpot.end_date_time).all()

    address = [result[0] for result in results]
    rate_per_half_hour = [result[1] for result in results]
    lat = [result[2] for result in results]
    lng = [result[3] for result in results]
    start_date_time = [result[4] for result in results]
    end_date_time = [result[5] for result in results]
    

    parking_data = [{
        "address": address,
        "rate_per_half_hour": rate_per_half_hour,
        "lat": lat,
        "lng": lng,
        "startdatetime": start_date_time,
        "enddatetime": end_date_time
    }]

    return jsonify(parking_data)

@app.route("/api/get_last_10_spots")
def get_last_10_spots():
    results = db.session.query(ParkingSpot.address, ParkingSpot.rate_per_half_hour, ParkingSpot.lat, ParkingSpot.lng, ParkingSpot.start_date_time, ParkingSpot.end_date_time).order_by(ParkingSpot.garage_id.desc()).limit(10)

    address = [result[0] for result in results]
    rate_per_half_hour = [result[1] for result in results]
    lat = [result[2] for result in results]
    lng = [result[3] for result in results]
    start_date_time = [result[4] for result in results]
    end_date_time = [result[5] for result in results]
    

    parking_data = [{
        "address": address,
        "rate_per_half_hour": rate_per_half_hour,
        "lat": lat,
        "lng": lng,
        "startdatetime": start_date_time,
        "enddatetime": end_date_time
    }]

    return jsonify(parking_data)


@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug = True)



