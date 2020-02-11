select * from parking_share_spots_staging
select * from parking_share_spots

select count(*) from parking_share_spots_staging
select count(*) from parking_share_spots

select cast(substring(garage_id, 3, length(garage_id)) as int), 
cast(substring(cust_id, 4, length(cust_id)) as int)
from parking_share_spots_staging

update  parking_share_spots_staging

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
	cust_id varchar(20),
	cell varchar(20)
)

insert into parking_share_spots
select 	cast(substring(garage_id, 3, length(garage_id)) as int), address,lat,lng, cast(replace(rate_per_half_hour, '$', '') as float),
carpark_type_str,capacity,start_date_time,start_date,start_time,end_date_time,end_date,end_time,duration_type,parking_type,
cast(substring(cust_id, 4, length(cust_id)) as int),cell
from parking_share_spots_staging
where start_date_time is not null

delete from parking_share_spots

alter table parking_share_spots
alter column garage_id TYPE int

drop table parking_share_spots
CREATE TABLE parking_share_spots
(
	garage_id int not null,
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
	cust_id int not null,
	cell varchar(20)
)

ALTER TABLE parking_share_spots ADD PRIMARY KEY (garage_id, cust_id, start_date_time, end_date_time);




delete from parking_share_spots where garage_id not like 'GP%'

