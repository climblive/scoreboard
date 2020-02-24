INSERT INTO `user` (id, name, username, admin) VALUES (1, 'Darth Vader', 'vader', 0);

INSERT INTO `organizer` (id, name, homepage) VALUES (1, 'Klätterpyramiden AB', 'klätterpyramiden.se');

INSERT INTO `user_organizer` (user_id, organizer_id) VALUES (1, 1);

INSERT INTO `contest` (id, organizer_id, protected, series_id, name, description, location_id, final_enabled, qualifying_problems, finalists, rules, grace_period) VALUES
    (1, 1, 0, NULL, 'Mongo Bouldering World Championship', NULL, NULL, 1, 3, 8, NULL, 15);

INSERT INTO `contender` (id, contest_id, registration_code, name, class_id, entered, disqualified) VALUES
    (1 , 1, 'ABCD1234', NULL, NULL, NULL, 0);

INSERT INTO `comp_class` (id, contest_id, name, description, time_begin, time_end) VALUES
    (1, 1, 'Male', NULL, '2040-01-01 17:00:00', '2040-01-01 20:00:00'),
    (2, 1, 'Female', NULL, '2040-01-01 17:00:00', '2040-01-01 20:00:00'),
    (3, 1, 'Youth', NULL, '2040-01-01 17:00:00', '2040-01-01 20:00:00');

INSERT INTO `color` (id, organizer_id, name, rgb_primary, rgb_secondary, shared) VALUES
    (1, 1, 'Red', '#ff0000', NULL, 1),
    (2, 1, 'Green', '#00ff00', NULL, 1),
    (3, 1, 'Blue', '#0000ff', NULL, 1);

INSERT INTO `problem` (id, contest_id, number, color_id, points, flash_bonus) VALUES
    (1, 1, 1, 1, 150, 6),
    (2, 1, 2, 2, 50, NULL),
    (3, 1, 3, 3, 100, 6),
    (4, 1, 4, 1, 50, NULL),
    (5, 1, 5, 2, 250, 12),
    (6, 1, 6, 3, 200, 6),
    (7, 1, 7, 1, 300, 12),
    (8, 1, 8, 2, 25, 6);