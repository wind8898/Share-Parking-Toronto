# I am trying to input the data collected from form.html into our database


import os
from flask_sqlalchemy import SQLAlchemy
from model import ParkingSpot

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

# third party libary to calculate the lat and log of the address
from geopy.geocoders import Nominatim
'''
when the seller input their address, we need to convert them into latitude and longitude
I have found a python library to calculate the latitude and longtitude

We need to install the library first:

pip install geopy

library url for your reference: https://pypi.org/project/geopy/
'''

app = Flask(__name__)

DB_URL = 'postgresql://eynjeleywopzpd:faa6c1ed8f60c969b72d838fe60e02cc5e2bb3bfc614b01e5449db9f6c3b1dee@ec2-34-235-108-68.compute-1.amazonaws.com:5432/dcuv8ruasf6mj0'

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)


# Steven Code Starts here
@app.route('/form.html')

def form():
    return render_template("form.html")

@app.route("/sent", methods=["GET", "POST"])
def sent():
    if request.method == "POST":
        #  convert the address to lat, lon
        location = request.form["location"]
        geolocator = Nominatim(user_agent="share-parking-toronto")
        location = geolocator.geocode(location)

        address = location.address
        lat = float(location.latitude)
        lng = float(location.longitude)


        garage_id = request.form["cell"]
        start_date = request.form["startdate"]
        start_time = request.form["starttime"]
        end_date = request.form["enddate"]
        end_time = request.form["endtime"]
        rate_per_half_hour = request.form["price"]
        cell = request.form["cell"]
        cust_id = request.form["cell"]
        parking_type = "public"
        duration_type = "long-term"
        capacity = request.form["cell"]
        carpark_type_str = "Garage"
        
        record = ParkingSpot(garage_id=garage_id, address=address, lat=lat, lng=lng, start_date=start_date, start_time=start_time, end_date=end_date, end_time=end_time, rate_per_half_hour=rate_per_half_hour, cell=cell, cust_id=cust_id, duration_type=duration_type, capacity=capacity, parking_type=parking_type, carpark_type_str=carpark_type_str)

        db.session.add(record)
        db.session.commit()
        return redirect("/", code=302)

    return render_template("form.html")

#  Steven code ends here


@app.route("/api/get_parking_spots")
def get_parking_spots():
    results = db.session.query(ParkingSpot.garage_id, ParkingSpot.rate_per_half_hour, ParkingSpot.lat, ParkingSpot.lng).all()

    garage_id = [result[0] for result in results]
    rate_per_half_hour = [result[1] for result in results]
    lat = [result[2] for result in results]
    lng = [result[3] for result in results]

    parking_data = [{
        "garage_id": garage_id,
        "rate_per_half_hour": rate_per_half_hour,
        "lat": lat,
        "lng": lng
    }]

    return jsonify(parking_data)

@app.route("/")
def home():
    return render_template("index.html")



if __name__ == "__main__":
    app.run(debug = True)
