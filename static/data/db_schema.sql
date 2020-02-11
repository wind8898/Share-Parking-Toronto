select * from parking_share_spots_staging
select * from parking_share_spots

select count(*) from parking_share_spots_staging
select count(*) from parking_share_spots


DROP TABLE parking_share_spots_staging
CREATE TABLE parking_share_spots_staging
(
	garage_id varchar(20),
	address varchar(200),
	lat float,
	lng float,
	rate_per_half_hour varchar(10),
	carpark_type_str varchar(50),
	capacity int,
	start_date_time timestamp,
	start_date date,
	start_time time,
	end_date_time timestamp,
	end_date date,
	end_time time,
	duration_type varchar(50),
	parking_type varchar(50),
	cust_id varchar(50),
	cell varchar(20)
)

insert into parking_share_spots
select 	garage_id, address,lat,lng, cast(replace(rate_per_half_hour, '$', '') as float),carpark_type_str,capacity,start_date_time,start_date,start_time,end_date_time,end_date,end_time,duration_type,parking_type,cust_id,cell
from parking_share_spots_staging
where start_date_time is not null

drop table parking_share_spots
CREATE TABLE parking_share_spots
(
	garage_id varchar(20) not null,
	address varchar(200),
	lat float,
	lng float,
	rate_per_half_hour varchar(50),
	carpark_type_str varchar(20),
	capacity varchar(50),
	start_date_time varchar(50),
	start_date varchar(50),
	start_time varchar(50),
	end_date_time varchar(50),
	end_date varchar(50),
	end_time varchar(50),
	duration_type varchar(50),
	parking_type varchar(50),
	cust_id varchar(50) not null,
	cell varchar(20)
)

ALTER TABLE parking_share_spots ADD PRIMARY KEY (garage_id, cust_id, start_date_time, end_date_time);