-- BerthId = 1
-- Insert example data into AlarmSetting for 'distance'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "defaultValue",
                                "createdAt",
                                "updatedAt")
VALUES  ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 1 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 1 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 1 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 1 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 1 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 1 ), now(), now());

-- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 30, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 30, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =1),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 5, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 10, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =1),  3, '<=', 90, now(), now());

-- ZONE 2
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =1),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =1),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =1),  3, '<=', 90, now(), now());

-- ZONE 3
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =1),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =1),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =1),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =1),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =1),  3, '<=', 90, now(), now());
       
       -- BerthId = 2
-- Insert example data into AlarmSetting for 'distance'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "defaultValue",
                                "createdAt",
                                "updatedAt")
VALUES  ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 2 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 2 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 2 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 2 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 2 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 2 ), now(), now());

-- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 30, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 30, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =2),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 5, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 10, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =2),  3, '<=', 90, now(), now());

-- ZONE 2
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =2),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =2),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =2),  3, '<=', 90, now(), now());

-- ZONE 3
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =2),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =2),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =2),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =2),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =2),  3, '<=', 90, now(), now());
       
       
       -- BerthId = 3
-- Insert example data into AlarmSetting for 'distance'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "defaultValue",
                                "createdAt",
                                "updatedAt")
VALUES  ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 3 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 3 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 3 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 3 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 3 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 3 ), now(), now());

-- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 30, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 30, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =3),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 5, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 10, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =3),  3, '<=', 90, now(), now());

-- ZONE 2
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =3),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =3),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =3),  3, '<=', 90, now(), now());

-- ZONE 3
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =3),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =3),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =3),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =3),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =3),  3, '<=', 90, now(), now());
       
       
       -- BerthId = 4
-- Insert example data into AlarmSetting for 'distance'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "defaultValue",
                                "createdAt",
                                "updatedAt")
VALUES  ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 4 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 4 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 4 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 4 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 4 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 4 ), now(), now());

-- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 30, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 30, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =4),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 5, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 10, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =4),  3, '<=', 90, now(), now());

-- ZONE 2
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =4),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =4),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =4),  3, '<=', 90, now(), now());

-- ZONE 3
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =4),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =4),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =4),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =4),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =4),  3, '<=', 90, now(), now());
       
       
       -- BerthId = 5
-- Insert example data into AlarmSetting for 'distance'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "defaultValue",
                                "createdAt",
                                "updatedAt")
VALUES  ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 5 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 5 ), now(), now()),
       ('distance', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 5 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  1, '>=', 10, (select b."limitZone1" from "Berth" b where b."id" = 5 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  2, '>=', 5, (select b."limitZone1" from "Berth" b where b."id" = 5 ), now(), now()),
       ('distance', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  3, '>=', 0, (select b."limitZone1" from "Berth" b where b."id" = 5 ), now(), now());

-- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 30, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 30, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_1', (select b."id" from "Berth" b where b."id" =5),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 5, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 10, now(), now()),
       ('angle', null, 'zone_1', (select b."id" from "Berth" b where b."id" =5),  3, '<=', 90, now(), now());

-- ZONE 2
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =5),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_2', (select b."id" from "Berth" b where b."id" =5),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_2', (select b."id" from "Berth" b where b."id" =5),  3, '<=', 90, now(), now());

-- ZONE 3
 -- Insert example data into AlarmSetting for 'speed'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES  ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 40, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 60, now(), now()),
       ('speed', 'left_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =5),  3, '<', NULL, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 40, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 60, now(), now()),
       ('speed', 'right_sensor', 'zone_3', (select b."id" from "Berth" b where b."id" =5),  3, '<', NULL, now(), now());

-- Insert example data into AlarmSetting for 'angle'
INSERT INTO "AlarmSetting" ("alarmType",
                                "alarmSensor",
                                "alarmZone",
                                "berthId",
                                "statusId",
                                "operator",
                                value,
                                "createdAt",
                                "updatedAt")
VALUES ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =5),  1, '<=', 10, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =5),  2, '<=', 20, now(), now()),
       ('angle', null, 'zone_3', (select b."id" from "Berth" b where b."id" =5),  3, '<=', 90, now(), now());