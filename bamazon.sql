drop database bamazon;
create database bamazon
use bamazon
create table products(
id int not null auto_increment,
product_name varchar(100) not null,
department_name varchar(100),
-- float(100,2) means "use 100 digits, of which two are used after the decimal point".
-- price int  not null,
price float(100, 2) not null,
stock_qty int not null,
primary key(id)
);
insert into products(product_name, department_name , price, stock_qty) 
values ('Photo Albums', 'Housewares', 15, 20); 
insert into products(product_name, department_name , price, stock_qty) 
values ('Silk Chiffon Dress', 'Womens', 1500, 3), ('Crystal Earrings', 'Accessories', 55, 6),
('Woven Handbag', 'Accessories', 355, 3), ('Tall boots', 'Shoes', 155, 9), 
('Wedge Sandal', 'Shoes', 109, 12), ('Sunglasses','Accessories', 45, 7), 
('Cotton T-shirt', 'Womens', 19.55, 25), ('Liquid Lipstick', 'Beauty', 19.45, 45), 
('Hair Dryer', 'Beauty', 79.35, 35);
select * from products
