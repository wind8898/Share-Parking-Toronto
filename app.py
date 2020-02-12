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


app = Flask(__name__)

DB_URL = 'postgresql://eynjeleywopzpd:faa6c1ed8f60c969b72d838fe60e02cc5e2bb3bfc614b01e5449db9f6c3b1dee@ec2-34-235-108-68.compute-1.amazonaws.com:5432/dcuv8ruasf6mj0'

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)

@app.route('/form.html')

def form():
    return render_template("form.html")


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
        location = request.form["location"]
        geolocator = Nominatim(user_agent="share-parking-toronto")
        location = geolocator.geocode(location)

        address = location.address
        lat = float(location.latitude)
        lng = float(location.longitude)

        garage_id = next_garage_id
        address = request.form["location"]
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
        return redirect("/", code=302)

    return render_template("form.html")


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

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug = True)



