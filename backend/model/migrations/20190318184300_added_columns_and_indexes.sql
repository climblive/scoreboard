ALTER TABLE `organizer` CHANGE COLUMN `homepage` `homepage` VARCHAR(255) NULL;

ALTER TABLE `contest`
    ADD COLUMN `rules` TEXT NULL AFTER `qualifying_problems`;

RENAME TABLE `class` TO `comp_class`;

ALTER TABLE `comp_class`
    ADD COLUMN `description` VARCHAR(255) NULL AFTER `name`,
    CHANGE COLUMN `time_begin` `time_begin` TIMESTAMP NOT NULL,
    CHANGE COLUMN `time_end` `time_end` TIMESTAMP NOT NULL,
    DROP FOREIGN KEY `fk_class_1`,
    ADD CONSTRAINT `fk_comp_class_1`
        FOREIGN KEY (`contest_id`)
        REFERENCES `contest` (`id`)
        ON DELETE CASCADE
        ON UPDATE RESTRICT;

ALTER TABLE `color`
    ADD COLUMN `rgb` VARCHAR(6) NULL DEFAULT NULL AFTER `name`;

UPDATE `color` AS c1 LEFT JOIN `color` AS c2 ON c1.id = c2.id SET c1.`rgb` = CONCAT(LPAD(HEX(c2.`red`), 2, '0'), LPAD(HEX(c2.`green`), 2, '0'), LPAD(HEX(c2.`blue`), 2, '0'));

ALTER TABLE `color`
    DROP COLUMN `red`,
    DROP COLUMN `green`,
    DROP COLUMN `blue`,
    CHANGE COLUMN `rgb` `rgb` VARCHAR(6) NOT NULL;

CREATE UNIQUE INDEX `name_UNIQUE` ON `color` (`name` ASC);

CREATE UNIQUE INDEX `index3` ON `problem` (`number` ASC, `contest_id` ASC);

CREATE UNIQUE INDEX `index4` ON `tick` (`contender_id` ASC, `problem_id` ASC);
    
