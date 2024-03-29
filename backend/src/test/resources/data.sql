INSERT INTO `user` (id, name, username, admin) VALUES (1, 'Darth Vader', 'vader', 0);

INSERT INTO `organizer` (id, name, homepage) VALUES (1, 'Klätterpyramiden AB', 'klätterpyramiden.se');

INSERT INTO `user_organizer` (user_id, organizer_id) VALUES (1, 1);

INSERT INTO `contest` (id, organizer_id, protected, series_id, name, description, location, final_enabled, qualifying_problems, finalists, rules, grace_period) VALUES
    (1, 1, 0, NULL, 'Mongo Bouldering World Championship', NULL, 'Planet Earth', 1, 3, 8, NULL, 15);

INSERT INTO `contender` (id, organizer_id, contest_id, registration_code, name, class_id, entered, disqualified) VALUES
    (1, 1, 1, 'ABCD1234', NULL, NULL, NULL, 0);

INSERT INTO `comp_class` (id, organizer_id, contest_id, name, description, time_begin, time_end) VALUES
    (1, 1, 1, 'Male', NULL, '2040-01-01 17:00:00', '2040-01-01 20:00:00'),
    (2, 1, 1, 'Female', NULL, '2040-01-01 17:00:00', '2040-01-01 20:00:00'),
    (3, 1, 1, 'Youth', NULL, '2040-01-01 17:00:00', '2040-01-01 20:00:00');

INSERT INTO `problem` (id, organizer_id, contest_id, number, hold_color_primary, hold_color_secondary, points, flash_bonus) VALUES
    (1, 1, 1, 1, '#ff0000', NULL, 150, 6),
    (2, 1, 1, 2, '#00ff00', NULL, 50, NULL),
    (3, 1, 1, 3, '#0000ff', NULL, 100, 6),
    (4, 1, 1, 4, '#ff0000', NULL, 50, NULL),
    (5, 1, 1, 5, '#00ff00', NULL, 250, 12),
    (6, 1, 1, 6, '#0000ff', NULL, 200, 6),
    (7, 1, 1, 7, '#ff0000', NULL, 300, 12),
    (8, 1, 1, 8, '#00ff00', NULL, 25, 6);