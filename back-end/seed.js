require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  console.log('Seeding PMS database...');

  
  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('TRUNCATE TABLE Promotion_Vehicles');
  await db.query('TRUNCATE TABLE Promotions');
  await db.query('TRUNCATE TABLE Customers');
  await db.query('TRUNCATE TABLE Vehicles');
  await db.query('TRUNCATE TABLE Users');
  await db.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Tables cleared.');


  const hash = await bcrypt.hash('blaise123', 10);
  const users = [
    ['blaise',     hash, 'admin'],
    ['jmugabo',   hash, 'staff'],
    ['niyonzima', hash, 'staff'],
    ['kayitesi',  hash, 'staff'],
    ['alice',hash,'alice'],
  ];
  for (const [UserName, Password, Role] of users) {
    await db.query('INSERT INTO Users (UserName, Password, Role) VALUES (?,?,?)', [UserName, Password, Role]);
  }
  console.log(`Inserted ${users.length} users.`);

  
  const vehicles = [
    ['RAD 001A', 'Toyota',     'RAV4',      2022, 'SUV',     28500000.00, 'Available',         1],
    ['RAD 002B', 'Honda',      'Civic',      2021, 'Sedan',   18500000.00, 'Available',         1],
    ['RAD 003C', 'Nissan',     'X-Trail',    2023, 'SUV',     32000000.00, 'Rented',            2],
    ['RAD 004D', 'Toyota',     'Hilux',      2020, 'Truck',   35000000.00, 'Available',         2],
    ['RAD 005E', 'Suzuki',     'Swift',      2022, 'Sedan',   12000000.00, 'Sold',              3],
  
  ];
  for (const [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, RegisteredBy] of vehicles) {
    await db.query(
      'INSERT INTO Vehicles (Plate_Number,Brand,Model,Year,Vehicle_Type,Purchase_Price,Status,RegisteredBy) VALUES (?,?,?,?,?,?,?,?)',
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, RegisteredBy]
    );
  }
  console.log(`Inserted ${vehicles.length} vehicles.`);


  const customers = [
    ['Jean',      'Mukamana',      'jean.mukamana@email.com',        '+250788123456', 'Active'],
    ['Alice',     'Uwase',         'alice.uwase@email.com',          '+250789234567', 'Active'],
    ['Patrick',   'Habimana',      'patrick.habimana@email.com',     '+250787345678', 'Active'],
    ['Grace',     'Ingabire',      'grace.ingabire@email.com',       '+250786456789', 'Inactive'],
    ['Eric',      'Nshimiyimana',  'eric.nshimiyimana@email.com',    '+250785567890', 'Active'],
    ['Diane',     'Murekatete',    'diane.murekatete@email.com',     '+250784678901', 'Blocked'],
    ['Fabrice',   'Niyonzima',     'fabrice.niyonzima@email.com',    '+250783789012', 'Active'],
    ['Claudine',  'Uwimana',       'claudine.uwimana@email.com',     '+250782890123', 'Active'],
 
  ];
  for (const [FirstName, LastName, Email, PhoneNumber, Status] of customers) {
    await db.query(
      'INSERT INTO Customers (FirstName,LastName,Email,PhoneNumber,Status) VALUES (?,?,?,?,?)',
      [FirstName, LastName, Email, PhoneNumber, Status]
    );
  }
  console.log(`Inserted ${customers.length} customers.`);


  const promotions = [
    ['New Year Sale',            'Start the year with unbeatable deals on selected fleet vehicles.',       'Percentage',      15.00, '2025-01-01', '2025-01-31', 'Expired', 1],
    ['Holiday Price Slash',      'Festive season flat-rate discounts for loyal SwiftWheel customers.',    'Flat_Rate',   500000.00, '2025-06-01', '2025-06-30', 'Active',   1],
    ['Weekend Flash Sale',       '48-hour flash deals every weekend on premium rentals and SUVs.',        'Percentage',      20.00, '2025-06-07', '2025-12-31', 'Active',   2],
    ['Clearance Discount Offer', 'Clearance pricing on vehicles ready for immediate sale.',               'Amount',     2000000.00, '2025-05-15', '2025-07-15', 'Active',   2],
    ['Seasonal Price Drop',      'Seasonal cashback on SUVs and vans for corporate clients.',             'Cashback',    750000.00, '2025-06-01', '2025-08-31', 'Active',   3],
    ['Weekend Flash Sale',       'Buy-one-get-one rental offer on sedans for the weekend.',               'Buy_One_Get_One', 0.00, '2025-02-01', '2025-02-28', 'Expired',  1],
    ['Holiday Price Slash',      'Bundle rental packages for holiday travelers across Rwanda.',           'Bundle',     1200000.00, '2025-07-01', '2025-07-31', 'Active',   3],
    ['New Year Sale',            'Free first-day rental on selected fleet vehicles for new customers.',   'Free',            0.00, '2026-01-01', '2026-01-07', 'Active',   4],
    ['Seasonal Price Drop',      'Seasonal markdown on trucks for construction and logistics firms.',     'Amount',     1500000.00, '2025-06-01', '2025-09-30', 'Active',   2],
    ['Clearance Discount Offer', 'End-of-quarter clearance with percentage discount on aging stock.',    'Percentage',      25.00, '2025-06-01', '2025-06-30', 'Active',   1],
  ];
  for (const [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, CreatedBy] of promotions) {
    await db.query(
      'INSERT INTO Promotions (Title,Description,Discount_Type,Discount_Value,Start_Date,End_Date,Status,CreatedBy) VALUES (?,?,?,?,?,?,?,?)',
      [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, CreatedBy]
    );
  }
  console.log(`Inserted ${promotions.length} promotions.`);

  
  const promoVehicles = [
    [1, 1, 'Good'],
    [1, 2, 'Excellent'],
    [2, 1, 'Excellent'],
    [2, 3, 'Good'],
    [2, 4, 'Good'],
    [3, 1, 'Excellent'],
    [3, 2, 'Good'],
    [3, 9, 'Average'],
    [4, 5, 'Excellent'],
    [4, 6, 'Average'],
    [5, 3, 'Good'],
    [5, 6, 'Good'],
    [5, 8, 'Poor'],
    [6, 2, 'Average'],
    [6, 7, 'Good'],
    [7, 4, 'Excellent'],
    [7, 6, 'Good'],
    [8, 2, 'Good'],
    [8, 7, 'Excellent'],
    [9, 4,  'Good'],
    [9, 10, 'Excellent'],
    [10, 5,  'Excellent'],
    [10, 14, 'Good'],
  ];
  for (const [Promotion_id, Vehicle_id, Performance] of promoVehicles) {
    await db.query(
      'INSERT INTO Promotion_Vehicles (Promotion_id,Vehicle_id,Performance) VALUES (?,?,?)',
      [Promotion_id, Vehicle_id, Performance]
    );
  }
  console.log(`Inserted ${promoVehicles.length} promotion-vehicle links.`);

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
