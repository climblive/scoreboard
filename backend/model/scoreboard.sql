-- MySQL Script generated by MySQL Workbench
-- mån 18 mar 2019 19:22:05
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema scoreboard
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `location` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL,
  `longitude` VARCHAR(8) NOT NULL,
  `latitude` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `organizer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL,
  `homepage` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `contest`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contest` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `organizer_id` INT NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `description` TEXT NULL,
  `location_id` INT NOT NULL,
  `qualifying_problems` INT NOT NULL,
  `rules` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_contest_1`
    FOREIGN KEY (`location_id`)
    REFERENCES `location` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_contest_2`
    FOREIGN KEY (`organizer_id`)
    REFERENCES `organizer` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB;

CREATE INDEX `fk_contest_1_idx` ON `contest` (`location_id` ASC);

CREATE INDEX `fk_contest_2_idx` ON `contest` (`organizer_id` ASC);


-- -----------------------------------------------------
-- Table `comp_class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `comp_class` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contest_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NULL,
  `time_begin` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_end` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_comp_class_1`
    FOREIGN KEY (`contest_id`)
    REFERENCES `contest` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT)
ENGINE = InnoDB;

CREATE INDEX `index2` ON `comp_class` (`contest_id` ASC);

CREATE INDEX `index3` ON `comp_class` (`id` ASC, `contest_id` ASC);


-- -----------------------------------------------------
-- Table `contender`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contender` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contest_id` INT NOT NULL,
  `registration_code` VARCHAR(16) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `class_id` INT NOT NULL,
  `entered` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_contender_1`
    FOREIGN KEY (`class_id` , `contest_id`)
    REFERENCES `comp_class` (`id` , `contest_id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_contender_2`
    FOREIGN KEY (`contest_id`)
    REFERENCES `contest` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB;

CREATE INDEX `fk_contender_1_idx` ON `contender` (`class_id` ASC, `contest_id` ASC);

CREATE UNIQUE INDEX `registration_code_UNIQUE` ON `contender` (`registration_code` ASC);

CREATE INDEX `fk_contender_2_idx` ON `contender` (`contest_id` ASC);


-- -----------------------------------------------------
-- Table `color`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `color` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `rgb` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `name_UNIQUE` ON `color` (`name` ASC);


-- -----------------------------------------------------
-- Table `problem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `problem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contest_id` INT NOT NULL,
  `number` INT NOT NULL,
  `color_id` INT NOT NULL,
  `points` INT NOT NULL,
  `flash_bonus` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_problem_1`
    FOREIGN KEY (`contest_id`)
    REFERENCES `contest` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_problem_2`
    FOREIGN KEY (`color_id`)
    REFERENCES `color` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB;

CREATE INDEX `fk_problem_1_idx` ON `problem` (`contest_id` ASC);

CREATE UNIQUE INDEX `index3` ON `problem` (`number` ASC, `contest_id` ASC);

CREATE INDEX `fk_problem_2_idx` ON `problem` (`color_id` ASC);


-- -----------------------------------------------------
-- Table `tick`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tick` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contender_id` INT NOT NULL,
  `problem_id` INT NOT NULL,
  `flash` TINYINT(1) NOT NULL DEFAULT 0,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tick_1`
    FOREIGN KEY (`problem_id`)
    REFERENCES `problem` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_tick_2`
    FOREIGN KEY (`contender_id`)
    REFERENCES `contender` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB;

CREATE INDEX `fk_tick_1_idx` ON `tick` (`problem_id` ASC);

CREATE INDEX `fk_tick_2_idx` ON `tick` (`contender_id` ASC);

CREATE UNIQUE INDEX `index4` ON `tick` (`contender_id` ASC, `problem_id` ASC);


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL,
  `email` VARCHAR(64) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `username_UNIQUE` ON `user` (`email` ASC);


-- -----------------------------------------------------
-- Table `user_organizer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_organizer` (
  `user_id` INT NOT NULL,
  `organizer_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `organizer_id`),
  CONSTRAINT `fk_user_organizer_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_organizer_2`
    FOREIGN KEY (`organizer_id`)
    REFERENCES `organizer` (`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT)
ENGINE = InnoDB;

CREATE INDEX `fk_user_organizer_2_idx` ON `user_organizer` (`organizer_id` ASC);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
