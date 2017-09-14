170911

# DataBase Modeling

1. 회원 => 회원번호, 아이디, 패스워드, 이름, 전화번호,  성별, 생년월일, 가입일자, 탈퇴일자, 주소, 연령대  
2. 로그인 => 로그인 일시,  IP, 회원번호  
3. 장바구니 => 장바구니 번호, 상품번호, 담은시간, 회원번호  
4. 상품 => 상품번호, 상품명, 가격, 사이즈  
5. 구매 => 회원번호, 구매시간, 상품번호  
6. 생일쿠폰 => 쿠폰번호, 회원번호  


## 시나리오

- 회원가입을 통하여 이 쇼핑몰 사이트를 이용할 수 있다.   
- 회원은 로그인을 할 때마다 로그인정보(로그인 일시, 아이디, IP, 회원번호)가 기록된다.  
- 회원가입시 필요한 정보는 (회원번호, 아이디, 패스워드, 가입일자, 탈퇴일자, 주소, 전화번호, 연령대, 성별)이다.  
- 회원은 물품을 검색할 수 있다.  
- 검색된 물품은 (상품명, 가격, 사이즈)가 보여진다.  
- 회원은 물품을 장바구니에 담을 수 있다.  
- 회원은 물건을 구매할 경우 (구매시간, 회원번호, 상품번호) pk로 가지게 된다.  
- 회원은 생일이면 생일 쿠폰을 받는다.  

￼
## ERD

![Shopping ERD](../images/ERD.png)

## SQL 

```sql

-- MySQL Workbench Synchronization
-- Generated: 2017-09-13 19:19
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: 김세준

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `u-number` INT(11) NOT NULL COMMENT '	\n',
  `id` VARCHAR(45) NOT NULL COMMENT '		',
  `pwd` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `call` INT(11) NOT NULL,
  `gender` VARCHAR(45) NULL DEFAULT NULL,
  `birth` INT(11) NOT NULL,
  `join-date` DATETIME NOT NULL,
  `session-date` DATETIME NULL DEFAULT NULL,
  `address` VARCHAR(45) NOT NULL,
  `ages` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`u-number`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `mydb`.`Login` (
  `login-date` DATETIME NOT NULL,
  `IP` VARCHAR(45) NULL DEFAULT NULL,
  `User_u-number` INT(11) NOT NULL,
  PRIMARY KEY (`login-date`, `User_u-number`),
  INDEX `fk_Login_User1_idx` (`User_u-number` ASC),
  CONSTRAINT `fk_Login_User1`
    FOREIGN KEY (`User_u-number`)
    REFERENCES `mydb`.`User` (`u-number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `mydb`.`Basket` (
  `basket-number` INT(11) NOT NULL,
  `select-date` DATETIME NULL DEFAULT NULL,
  `User_u-number` INT(11) NOT NULL,
  `Product_product-number` INT(11) NOT NULL,
  PRIMARY KEY (`basket-number`, `User_u-number`, `Product_product-number`),
  INDEX `fk_Basket_User1_idx` (`User_u-number` ASC),
  INDEX `fk_Basket_Product1_idx` (`Product_product-number` ASC),
  CONSTRAINT `fk_Basket_User1`
    FOREIGN KEY (`User_u-number`)
    REFERENCES `mydb`.`User` (`u-number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Basket_Product1`
    FOREIGN KEY (`Product_product-number`)
    REFERENCES `mydb`.`Product` (`product-number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `mydb`.`Product` (
  `product-number` INT(11) NOT NULL,
  `product-name` VARCHAR(45) NULL DEFAULT NULL,
  `price` VARCHAR(45) NULL DEFAULT NULL,
  `size` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`product-number`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `mydb`.`Buy` (
  `buy-date` DATETIME NOT NULL,
  `Product_product-number` INT(11) NOT NULL,
  `User_u-number` INT(11) NOT NULL,
  PRIMARY KEY (`buy-date`, `Product_product-number`, `User_u-number`),
  INDEX `fk_Buy_Product1_idx` (`Product_product-number` ASC),
  INDEX `fk_Buy_User1_idx` (`User_u-number` ASC),
  CONSTRAINT `fk_Buy_Product1`
    FOREIGN KEY (`Product_product-number`)
    REFERENCES `mydb`.`Product` (`product-number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Buy_User1`
    FOREIGN KEY (`User_u-number`)
    REFERENCES `mydb`.`User` (`u-number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `mydb`.`Coupon` (
  `coupon-number` INT(11) NOT NULL,
  `User_u-number` INT(11) NOT NULL,
  PRIMARY KEY (`coupon-number`, `User_u-number`),
  INDEX `fk_생일쿠폰_User_idx` (`User_u-number` ASC),
  CONSTRAINT `fk_생일쿠폰_User`
    FOREIGN KEY (`User_u-number`)
    REFERENCES `mydb`.`User` (`u-number`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


use mydb;

SELECT * FROM user;

INSERT INTO  user VALUES (1,'sejune','kim','kimsejune','01045401088','men','930907','170913', null, '경기도 시흥시 정왕동', '25');

SELECT*FROM login;

INSERT INTO login VALUES(now(), '192.168.0.1', 1);

SELECT*FROM coupon;

INSERT INTO coupon VALUES(1, 1);

SELECT * FROM Product;

INSERT INTO product VALUES(1, '슬렉스(검정)', '200000', '29');

SELECT * FROM buy;

INSERT INTO buy VALUES (now(), 1, 1);

SELECT * FROM Basket;

INSERT INTO basket VALUES(1, now(), 1, 1);


```
