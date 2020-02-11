import os
from flask_sqlalchemy import SQLAlchemy
from model import *

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)


app = Flask(__name__)

DB_URL = 'postgresql://eynjeleywopzpd:faa6c1ed8f60c969b72d838fe60e02cc5e2bb3bfc614b01e5449db9f6c3b1dee@ec2-34-235-108-68.compute-1.amazonaws.com:5432/dcuv8ruasf6mj0'

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)

@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":

        garage_id = getNextGarageID() #function call to get next id
        address = request.form["address"]
        lat = request.form["lat"] #google api from location
        lng = request.form["lng"] #google api from location
        rate_per_half_hour = request.form["rate_per_half_hour"] 
        carpark_type_str = request.form["carpark_type_str"]
        capacity = request.form["capacity"]
        start_date_time = request.form["start_date_time"]
        start_date = request.form["start_date"]
        start_time = request.form["start_time"]
        end_date_time = request.form["end_date_time"]
        end_date = request.form["end_date"]
        end_time = request.form["end_time"]
        duration_type = request.form["duration_type"]
        parking_type = request.form["parking_type"]
        cust_id = getCustomerID(request.form["cell"])
        cell = request.form["cell"]
        
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


def getNextGarageID():
    max_id = db.session.query(db.func.max(ParkingSpot.garage_id)).all()
    print(max_id)

def getCustomerID(cell):
    cust_id = db.session.query(ParkingSpot.cust_id).filter(ParkingSpot.cell == cell).all()
    #if blank generate new id
    