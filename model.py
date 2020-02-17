from app import db

class ParkingSpot(db.Model):
    __tablename__ = 'parking_share_spots'

    garage_id = db.Column(db.Integer, primary_key = True)
    address = db.Column(db.String(64))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    rate_per_half_hour = db.Column(db.String(64))
    carpark_type_str = db.Column(db.String(64))
    capacity = db.Column(db.String(64))
    start_date_time = db.Column(db.String(64))
    start_date = db.Column(db.String(64))
    start_time = db.Column(db.String(64))
    end_date_time = db.Column(db.String(64))
    end_date = db.Column(db.String(64))
    end_time = db.Column(db.String(64))
    duration_type = db.Column(db.String(64))
    parking_type = db.Column(db.String(64))
    cust_id = db.Column(db.Integer)
    cell = db.Column(db.String(64))


    def __repr__(self):
        return '<ParkingSpot %r>' % (self.address)


class NearbyParking(db.Model):
    __tablename__ = 'nearby_parking'

    Location_Name = db.Column(db.String(64), primary_key = True)
    Location_Address = db.Column(db.String(64))
    Location_Price_Hour = db.Column(db.String(64))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)

