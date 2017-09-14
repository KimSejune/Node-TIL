170911

# DataBase

## 데이터베이스와 테이블의 생성

### CREATE DATABASE는 데이터베이스를 만드는 명령어입니다. 워크벤치에서 root 계정으로 로그인한 후, 아래의 SQL을 실행해보세요.

```sql
-- 데이터베이스 생성
CREATE DATABASE my_db;

-- 모든 데이터베이스의 목록
SHOW DATABASES;
```

### CREATE TABLE은 테이블을 만드는 명령입니다. 아래 명령을 차례로 실행해보세요.

```sql
-- 테이블 생성
CREATE TABLE my_db.users (
  -- `name`이라는 이름의 문자열 컬럼을 생성합니다. NULL을 허용하지 않습니다.
  name VARCHAR(30) NOT NULL,
  -- `job`이라는 이름의 문자열 컬럼을 생성합니다. NULL을 허용합니다.
  job VARCHAR(30),
  -- `age`라는 이름의 양수 컬럼을 생성합니다. NULL을 허용합니다.
  age INTEGER UNSIGNED,
  -- `name` 컬럼을 기본 키로 지정합니다.
  PRIMARY KEY (name)
);

-- my_db 데이터베이스에 있는 모든 테이블의 목록
SHOW TABLES FROM my_db;

-- my_db.users 테이블에 대한 자세한 정보
DESCRIBE my_db.users;
SHOW CREATE TABLE post;
```


### USE [database]는 기본 데이터베이스를 설정하는 명령입니다. 즉, SQL을 작성할 때 데이터베이스 이름을 생략할 수 있게 만들어줍니다. 워크벤치에서는 사이드바의 데이터베이스 이름을 더블 클릭해도 같은 동작을 합니다. 기본 데이터베이스를 선택한 후 아래 명령을 실행해보세요.

```sql
DESCRIBE my_table;

```


## 데이터 추가하기

```sql
-- 하나의 레코드 추가하기
INSERT INTO users (name, job, age)
VALUES ('윤민지', '프론트엔드 개발자', 32);

-- 여러 개의 레코드 추가하기
INSERT INTO users (name, job, age)
VALUES ('한주원', '프론트엔드 개발자', 39),
('박현숙', '백엔드 개발자', 48),
('정병언', NULL, 25),
('임동면', '디자이너', NULL);
```

## 데이터 불러오기

```sql
-- 모든 컬럼을 포함시켜 불러오기
SELECT * FROM users;
-- 특정 컬럼만 포함시켜 불러오기
SELECT name, job FROM users;
```

## 데이터 수정하기

```sql
UPDATE users
SET job = '프로그래머'
WHERE name = '정병언';
```

## 데이터 삭제하기

```sql
DELETE FROM users
WHERE name = '정병언';
```

## 데이터베이스와 테이블의 삭제

```sql
DROP DATABASE, DROP TABLE 명령은 각각 데이터베이스와 테이블을 삭제하는 명령입니다. 아래의 명령을 차례대로 실행해보세요.

-- users 테이블 삭제
DROP TABLE users;

-- my_db 데이터베이스 삭제
DROP DATABASE my_db;
```

## 관계형 데이터베이스의 구성요소

### Database (데이터베이스)

- 테이블 및 다른 구성요소들을 모아놓은 집합입니다.  
- 스키마라고도 불리는데, 스키마라는 용어는 '데이터베이스'를 의미하기도 하고 **'데이터베이스의 구조'**를 의미하기도 합니다.  
- 하나의 DBMS는 여러 개의 데이터베이스를 가질 수 있으며, 데이터베이스 단위로 `권한 설정`이 이루어집니다.  


### User & Privilege (사용자 & 권한)

- 하나의 DBMS는 여러 개의 사용자 계정을 가질 수 있습니다.  
- DBMS를 사용하려면 사용자 계정을 이용해 DBMS에 접속해야 합니다.  
- 사용자 계정은 데이터베이스 별로 다른 권한을 가집니다.  
- root 유저는 DBMS 초기 설치 시에 만들어지는 계정이며, DBMS에 대한 모든 권한을 부여받습니다.  

### Connection

- 사용자 계정을 이용해 데이터베이스에 접속하면, 새 `커넥션`이 만들어집니다.  
- 세션과 유사한 개념입니다.  
- 커넥션 별로 여러가지 옵션을 설정할 수 있고, `트랜잭션`도 커넥션 단위로 수행됩니다.  
- 하나의 클라이언트에서 여러 개의 트랜잭션을 수행하기 위해 여러 커넥션을 이용할 수 있습니다.  

### Table (테이블)

- 하나의 데이터베이스는 여러 개의 테이블을 가질 수 있습니다.  
- 표 형태로 구조화된 데이터가 테이블에 저장됩니다.  
- 테이블의 **행(row)**은 개별적인 레코드를 나타내며, 테이블의 **열(column)**은 레코드의 속성을 나타냅니다. 각각의 열에는 미리 정의된 자료형에 해당하는 데이터만 저장될 수 있습니다.  
- 테이블의 각 행은 기본 키(primary key)를 이용해 식별하고, 테이블 내에서 유일한 값이어야 합니다. 기본 키는 다른 테이블과의 관계를 나타낼 때 사용됩니다.  

### Constraint (제약 조건)

제약 조건을 지정하면 테이블에 특정한 방식으로만 데이터가 저장될 수 있도록 할 수 있습니다. 아래 제약 조건들이 자주 사용됩니다.  

- `NOT NULL` : 컬럼에 NULL 값이 저장되지 못하도록 막습니다.  
- `UNIQUE` : 한 테이블 내에서 컬럼에 저장된 모든 값이 유일하도록 강제합니다.  
- `PRIMARY KEY` : NOT NULL과 UNIQUE가 동시에 적용됩니다. PRIMARY KEY 제약 조건이 걸린 컬럼은 각 행의 식별자로 사용됩니다.  
- `FOREIGN KEY` : 다른 테이블의 primary key를 참조합니다. 해당 primary key를 가진 레코드가 변경되었을 때 특정 동작을 강제할 수 있습니다.  
- `DEFAULT` : INSERT 구문을 사용해서 레코드를 추가할 때, 컬럼에 아무런 값도 지정하지 않으면 DEFAULT 제약 조건으로 지정한 기본값이 저장되도록 합니다.  
- `CHECK` : 레코드가 주어진 계산식을 만족해야만 하도록 CHECK 제약 조건을 지정할 수 있습니다.  

```sql
CREATE TABLE adult (
  name varchar(255) NOT NULL,
  nationality varchar(255) DEFAULT '대한민국',
  age int,
  CHECK (age >= 18)
);
```

### Primary Key, Foreign Key

Primary Key(기본 키)로 지정된 컬럼에 저장되어 있는 값은 테이블에 저장되어 있는 레코드의 식별자 역할을 합니다. Foreign Key(외래 키)로 지정된 컬럼에는 다른 테이블의 기본 키 값이 저장되며, 다른 테이블의 레코드를 참조함으로써 해당 테이블과의 관계를 나타냅니다.  

여러 컬럼이 한꺼번에 기본 키로 지정될 수도 있습니다. 이를 Composite primary key(한국어로는 합성키, 혹은 슈퍼키라고 부름)라고 합니다.  


## 테이블 생성

테이블을 생성할 때는 `CREATE TABLE` 구문을 사용합니다.

```sql
CREATE TABLE my_table (
  -- 일반적인 컬럼은 아래와 같의 정의합니다. 이 컬럼에는 NULL 값이 저장될 수 있습니다.
  my_col1 INTEGER,

  -- 컬럼의 기본값을 지정합니다.
  my_col2 INTEGER DEFAULT 0,

  -- 컬럼에 NULL 값이 저장될 수 없도록 제한을 둡니다.
  my_col3 INTEGER NOT NULL,

  -- UNIQUE 제약조건: 컬럼의 값은 테이블 내에서 유일해야 합니다.
  my_col4 INTEGER UNIQUE,

  -- 다양한 옵션을 한 번에 지정할 수 있습니다.
  my_col5 INTEGER NOT NULL DEFAULT 1,
  my_col6 INTEGER NOT NULL UNIQUE,

  -- 1부터 시작하는 식별자를 아래와 같이 정의합니다.
  -- PRIMARY KEY는 기본적으로 NOT NULL, UNIQUE 규칙이 적용됩니다.
  my_id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- 컬럼 정의와 별도로, 여러가지 제약 조건과 인덱스를 아래에 지정할 수 있습니다.
  -- 제약 조건과 인덱스에 대해서는 추후 배울 것입니다.
  FOREIGN KEY (my_id) REFERENCES your_table(your_id) ON DELETE CASCADE,
  INDEX my_idx (my_col1, my_col2),
  ...
)
```

테이블이 이미 존재하는 경우에도 구문이 에러 없이 실행되도록 IF NOT EXISTS 구문을 사용할 수 있습니다.  

```sql
CREATE TABLE IF NOT EXISTS table_name (
  ...
)
```

## 테이블 수정

```sql
ALTER TABLE table_name
RENAME new_table_name, -- 테이블 이름 변경
ADD COLUMN column_name INTEGER NOT NULL, -- 컬럼 추가
ADD CONSTRAINT UNIQUE, -- 제약 조건 추가
CHANGE old_column_name new_column_name INTEGER, -- 컬럼 이름 변경
MODIFY column_name NEW_TYPE -- 컬럼 타입 변경
DROP COLUMN column_name; -- 컬럼 제거
```

자세한 사용법은 공식 문서를 참고해주세요.

## MySQL 데이터 타입

### 문자열

### VARCHAR

짧은 문자열을 저장하기 위해 가장 널리 사용되는 타입입니다. 컬럼 타입으로 지정할 때는 아래와 같이 문자열의 길이(바이트)를 명시해야 합니다.

```sql
VARCHAR(255) -- 255는 가장 널리 사용되는 길이입니다.
```

### TEXT

긴 문자열을 저장하기 위해 사용되는 타입입니다. TEXT 타입의 컬럼에는 64MB까지 저장할 수 있습니다. 요구사항에 따라 크기가 다른 다양한 종류의 TEXT 타입(TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT)을 사용할 수 있습니다.  

### 수

정수, 고정 소수점, 부동 소수점을 위한 타입이 있습니다. 모든 수 타입은 양수만을 저장하기 위해 타입 뒤에 UNSIGNED 지시자를 사용할 수 있습니다.  

### INTEGER

정수를 위한 타입입니다. INT로 줄여 쓸 수도 있습니다. 요구사항에 따라 크기가 다른 다양한 종류의 INT 타입(TINYINT, SMALLINT, MEDIUMINT, INT, BIGINT)을 사용할 수 있습니다.

```sql
INTEGER UNSIGNED -- INTEGER 타입의 양수를 저장할 수 있습니다.
```

MySQL에는 참, 거짓을 나타내는 boolean 관련 타입이 없습니다. 대신 TINYINT를 사용합니다.

### DECIMAL

고정 소수점 수를 위한 타입입니다. 십진수의 정확한 계산이 필요할 때 사용합니다. 정수부(최대 65), 소수부(최대 30, 정수부보다 짧거나 같아야 함)의 최대 길이를 각각 지정할 수 있습니다.  

```sql
DECIMAL(5, 2) -- 12345.67과 같은 수를 저장할 수 있습니다.
```

### DOUBLE

부동 소수점 수를 위한 타입입니다. 소수의 빠른 계산과 효율적 저장이 필요할 때 사용합니다.  

### 시각

MySQL에는 시각의 저장을 위한 타입들이 준비되어 있습니다. 주로 사용되는 아래의 두 타입은 시간대 정보를 저장하지 않기 때문에, 사용에 주의를 요합니다.  

### DATE

DATE 타입은 날짜를 위한 타입입니다.  

### DATETIME

DATETIME 타입은 날짜와 시각을 같이 저장해야 할 때 사용합니다.  

### 기타

ENUM: 열거형을 위한 타입입니다.  
JSON: MySQL 5.7에 JSON 지원이 추가되었으나, 널리 사용되지는 않습니다.  
POINT, GEOMETRY : 공간 정보를 위한 타입입니다.  

## 계정 만들기

실습하기에 앞서, employees 데이터베이스에만 접속할 수 있는 emplyees_user 계정을 만든 후 그 계정을 이용해 MySQL에 접속해봅시다.  

## SELECT

가장 단순한 SELECT 구문을 실행해보겠습니다.  

```sql
SELECT * FROM employees;
```

실행 후, 아래와 같이 결과가 나오면 성공입니다. employees 테이블에는 어떤 컬럼들이 있는지, 각 컬럼에는 어떤 형태의 데이터가 저장되고 있는지 파악해두도록 합시다.  

MySQL Workbench는 레코드의 갯수가 많을 경우에 1000개 단위로 페이지를 끊어서 보여주는 기능을 가지고 있습니다. 이미지의 우측 상단에 빨갛게 표시된 버튼들을 눌러서 페이지를 이동할 수 있습니다.  

이제 테이블의 일부 컬럼만 불러오는 구문을 실행해보겠습니다.  

```sql
SELECT first_name FROM employees;
```

위 명령은 employees 테이블에서 first_name 컬럼만을 불러옵니다. 아래와 같이 여러 개의 컬럼을 선택적으로 불러올 수 있습니다.  

```sql
SELECT first_name, last_name FROM employees;
```

또는 SQL 실행 결과로 출력되는 테이블의 컬럼의 이름을 바꾸어 출력할 수도 있습니다. 아래와 같이 각 컬럼의 이름 뒤에 AS 구문을 사용하면 됩니다. backtick(`) 문자를 사용해 컬럼의 이름에 MySQL 예약어나 공백 문자를 넣을 수 있습니다. (권장되지는 않습니다.)  

```sql
SELECT first_name AS `family name`, last_name AS `given name` FROM employees;
```

AS를 생략하고 써도 같은 의미입니다.

```sql
SELECT first_name `family name`, last_name `given name` FROM employees;
```

## 정렬하기

ORDER BY 구문을 사용하면 특정 컬럼에 대한 정렬 기준을 세워 테이블을 출력할 수 있습니다. 아래와 같이 hire_date 컬럼을 기준으로 오름차순 정렬을 시킬 수 있습니다.  

```sql
SELECT emp_no, hire_date, birth_date FROM employees
ORDER BY hire_date;
```

ORDER BY 구문에 포함된 컬럼이 꼭 SELECT 구문에 포함될 필요는 없습니다. 아래와 같이 SELECT 구문에서 hire_date를 생략해도 문제 없습니다.  

```sql
SELECT emp_no FROM employees
ORDER BY hire_date;
```
ORDER BY 구문은 여러 개의 컬럼에 대해서 정렬하는 기능도 지원합니다. 아래와 같이 여러 개의 컬럼을 쉼표로 구분해서 ORDER BY 구문에 넣어 주면 됩니다. 이 때, hire_date로 먼저 오름차순 정렬 되고 난 후, 같은 hire_date를 가진 레코드끼리 birth_date를 기준으로 오름차순 정렬이 이루어집니다.  

```sql
SELECT emp_no, hire_date, birth_date FROM employees
ORDER BY hire_date, birth_date;
```

ORDER BY 구문은 기본적으로 오름차순 정렬을 하게끔 되어 있습니다. 아래와 같이 DESC 구문을 사용하면 특정 컬럼에 대해서 내림차순 정렬을 하도록 명령할 수 있습니다. DESC와 ASC는 각각 'descending'과 'ascending'의 약자입니다.  

```sql
SELECT first_name, hire_date, birth_date FROM employees
ORDER BY hire_date DESC, birth_date ASC; -- ASC는 생략 가능
```

## Character Set & Collation

MySQL은 날짜, 숫자 뿐 아니라 문자열에 대한 정렬도 지원합니다. 아래와 같이 이름을 이용해 정렬을 할 수도 있습니다.  

```sql
SELECT first_name, last_name FROM employees
ORDER BY last_name, first_name;
```

MySQL은 다양한 언어와 문자셋을 지원합니다. 그런데 언어나 문자셋별로 문자열의 정렬 기준이 달라야 할 필요가 있습니다. 이러한 정렬 기준을 MySQL에서는 collation이라고 부릅니다.  

한글의 경우, 문자셋은 utf8, collation은 utf8mb4_general_ci를 사용하면 됩니다.  

MySQL 사용 중에 불러온 문자열이 깨져 보인다거나 정렬이 제대로 되지 않는다면, 문자셋과 collation의 설정이 잘못되었을 확률이 높습니다. 현재 데이터베이스의 기본 문자셋과 collation을 확인하려면, 아래와 같이 워크벤치 좌측 데이터베이스 목록의 'i' 모양 아이콘을 클릭하세요.  

## 일부만 가져오기

LIMIT 구문을 사용하면 레코드의 일부분만 불러올 수 있습니다.  

```sql
SELECT * FROM employees
LIMIT 5;
```

LIMIT 구문은 정렬 순서에 영향을 받습니다. 예를 들어, 생일이 가장 빠른 1명의 기록을 불러오고 싶다면 아래와 같이 하면 됩니다.  

```sql
SELECT first_name, birth_date FROM employees
ORDER BY birth_date
LIMIT 1;
```

OFFSET 구문을 사용하면 앞쪽 기록의 일부분을 생략하고 나머지 기록들을 불러올 수 있습니다. 예를 들어, 생일이 열 번째로 빠른 1명의 기록을 불러오고 싶다면 아래와 같이 하면 됩니다.  

```sql
SELECT first_name, birth_date FROM employees
ORDER BY birth_date
LIMIT 1 OFFSET 9;
```

## 중복되는 값 제거하기

DISTINCT 구문을 사용하면 컬럼 내에 중복되는 값을 하나로 합쳐서 보여줍니다. 아래 두 쿼리의 결과를 비교해보세요.  

```sql
SELECT first_name FROM employees
ORDER BY first_name;

SELECT DISTINCT first_name FROM employees
ORDER BY first_name;
```
## 필터링과 연산자

WHERE 구문을 사용하면 특정 조건을 만족하는 기록만을 선택적으로 불러올 수 있습니다.  

```sql
SELECT * FROM employees
WHERE first_name = 'Shahid' AND hire_date > '1997-09-12';
```

위와 같이 WHERE 구문에서는 조건을 나타내기 위해 연산자를 사용합니다. WHERE 구문 내에서 자주 사용되는 연산자와 그 뜻을 아래 표에서 확인할 수 있습니다.  

## 연산자 우선순위

여느 프로그래밍 언어가 그렇듯이 SQL에도 연산자 우선순위가 존재합니다. 예를 들어, OR보다 AND가 먼저 연산되기 때문에 아래와 같이 사용할 때는 주의해야 합니다.  

```sql
-- first_name이 'Jeong' 혹은 'Shahid'인 사람들 중, 입사일이 '1997-09-12' 이후인 사람들을 불러오기 (틀림)
SELECT * FROM employees
WHERE first_name = 'Jeong' OR first_name = 'Shahid' AND hire_date > '1997-09-12';
-- 뒤쪽의 AND가 먼저 연산되어, 원래 의도와는 다르게 first_name이 'Jeong'인 모든 사람들이 포함된 결과가 나옵니다.
```

아래와 같이 괄호를 사용해서 특정 연산이 먼저 실행되도록 할 수 있습니다.

```sql
-- first_name이 'Jeong' 혹은 'Shahid'인 사람들 중, 입사일이 '1997-09-12' 이후인 사람들을 불러오기
SELECT * FROM employees
WHERE (first_name = 'Jeong' OR first_name = 'Shahid') AND hire_date > '1997-09-12';
```
연산자 우선순위의 전체 목록을 확인하려면 공식 문서를 참고하세요.  

## DATE, DATETIME 리터럴

DATE 타입과 DATETIME 타입을 요구하는 문맥에서 아래와 같은 형태의 문자열을 사용하면, 자동으로 DATE와 DATETIME 형태로 해석됩니다.  

```sql
'YYYY-MM-DD HH:MM:SS' -- DATETIME을 나타내는 문자열 형식
'YYYY-MM-DD' -- DATE를 나타내는 문자열 형식
```

문자열을 사용해서 아래와 같이 hire_date와 같은 DATE 형태의 컬럼에 대해 필터링을 할 수 있습니다.  

```sql
SELECT * FROM employees
WHERE hire_date > '1997-09-12';
```

## NULL

NULL 값은 '데이터가 없음'을 나타내기 위한 목적으로 다루어지는 값입니다. 그런데 이 값은 연산 과정에서 특별하게 취급됩니다. 대부분의 연산자에 대해, 어떤 연산의 피연산자가 NULL이면 해당 연산의 결과는 무조건 NULL이 되게 됩니다.  

```sql
1 > NULL -- 결과는 NULL이 됩니다.
1 = NULL -- 결과는 NULL이 됩니다.
NULL = NULL -- 심지어 이것도 NULL이 됩니다!
```

따라서, NULL 값을 허용하는 컬럼에 대해 연산을 할 때는 주의해야 합니다. 특히, 어떤 컬럼의 값이 NULL인지 아닌지 확인하기 위해서는 = 연산자 대신에 IS 혹은 IS NOT 연산자를 사용해야 합니다. 이를 테스트해보기 위해 NULL 값이 포함된 컬럼을 하나 추가합시다.  

```sql
INSERT INTO titles (emp_no, title, from_date, to_date)
VALUES (10001, 'new title', '2017-09-11', NULL);
```

TRUE 혹은 FALSE를 써야하는 문맥에 NULL을 쓰면, FALSE로 취급됩니다. 아래 SQL 명령의 결과를 비교해보시기 바랍니다.  

```sql
-- 이렇게 하면 안 됩니다!
SELECT * FROM titles
WHERE to_date = NULL; -- 무조건 FALSE로 취급됨
-- 반드시 이렇게 해야 합니다.
SELECT * FROM titles
WHERE to_date IS NULL;
-- 이렇게 하면 안 됩니다!
SELECT * FROM titles
WHERE to_date != NULL; -- 무조건 FALSE로 취급됨
-- 반드시 이렇게 해야 합니다.
SELECT * FROM titles
WHERE to_date IS NOT NULL;
```

## salaries 테이블

실습용 employees 데이터베이스의 salaries 테이블에는 각 사원의 연봉 변동 내역이 저장되어 있습니다. 본 문서에서는 salaries 테이블을 이용해 실습합니다.  

## 집계 함수 (Aggregate Function)

MySQL은 여러가지 집계 함수를 지원합니다.  

집계 함수	의미  
MAX(col_name)	최대값  
MIN(col_name)	최소값  
SUM(col_name)	합계  
AVG(col_name)	평균  
COUNT(col_name)	컬림에 NULL이 아닌 값이 저장되어 있는 행의 갯수  
COUNT(*)	행의 갯수  

```sql

SELECT MAX(salary) FROM salaries;
SELECT MIN(salary) FROM salaries;
SELECT SUM(salary) FROM salaries;
SELECT AVG(salary) FROM salaries;
SELECT COUNT(*) FROM employees;
```

## GROUP BY

그룹이란 특정 컬럼에 같은 값을 갖고 있는 행들의 집합입니다. GROUP BY 구문을 사용해서, 위에서 했던 집계 작업을 그룹 단위로 수행할 수 있습니다.  

```sql
-- 각 사원이 연봉을 가장 많이 받을 때 얼마를 받았는지를 가져옵니다.
SELECT emp_no, max(salary) FROM salaries
GROUP BY emp_no;
```
```sql
-- 각 사원의 연봉이 총 몇 번 변경되었는지를 가져옵니다.
-- AS 구문을 이용해 집계 컬럼의 이름을 변경할 수 있습니다.
SELECT emp_no, count(*) AS salary_count FROM salaries
GROUP BY emp_no;
ORDER BY 구문을 사용해 그룹 집계의 결과를 정렬할 수도 있습니다.
```
```sql
-- 각 사원의 연봉이 총 몇 번 변경되었는지를 가져오고, 많이 변경된 순서대로 출력합니다.
SELECT emp_no, count(*) AS salary_count FROM salaries
GROUP BY emp_no
ORDER BY salary_count DESC;
WHERE 구문을 사용해 집계에 포함될 레코드를 한정시킬 수도 있습니다.
```
```sql
-- 각 사원의 연봉이 1996년부터 2000년까지 총 몇 번 변경되었는지를 가져오고, 많이 변경된 순서대로 출력합니다.
SELECT emp_no, count(*) AS salary_count FROM salaries
WHERE from_date BETWEEN '1996-01-01' AND '2000-12-31'
GROUP BY emp_no
ORDER BY salary_count DESC;
```

## HAVING
그룹 집계의 결과에서 특정 그룹을 필터링한 결과를 출력할 수도 있습니다. HAVING 구문을 사용하면 되고, 문법은 WHERE 구문과 비슷합니다.  

```sql
-- 최고 연봉이 15만 달러 이상인 사원의 사원 번호와 최고 연봉을 출력합니다.  
SELECT emp_no, max(salary) AS max_salary FROM salaries
GROUP BY emp_no
HAVING max_salary > 150000
ORDER BY max_salary DESC;
```

WHERE, GROUP BY, HAVING, ORDER BY을 모두 사용한 쿼리입니다. 각 구문은 아래와 같은 순서대로 사용되어야 합니다.  

```sql
-- 1996년과 2000년 사이에 받았던 최고 연봉이 15만 달러보다 높았던 사원의 사원 번호와 최고 연봉을 출력합니다.
SELECT emp_no, max(salary) as max_salary FROM salaries
WHERE from_date BETWEEN '1996-01-01' AND '2000-12-31'
GROUP BY emp_no
HAVING max_salary > 150000
ORDER BY max_salary DESC;
```

## 문자열 연산

`CONCAT` 함수를 이용해 문자열을 이어붙일 수 있습니다.  

```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;
```

`LOWER` 함수와 `UPPER` 함수는 각각 문자열을 소문자/대문자로 바꾸어줍니다.   

```sql
SELECT UPPER(first_name) FROM employees;
SELECT LOWER(first_name) FROM employees;
```

`LENGTH` 함수는 문자열의 길이를 반환합니다.  

```sql
SELECT first_name, LENGTH(first_name) AS length_first_name FROM employees
ORDER BY length_first_name DESC;
```

`SUBSTRING` 함수는 문자열의 일부분을 반환합니다. SUBSTRING(문자열, 자를 인덱스, 자를 길이)와 같이 사용합니다. 자를 인덱스는 1부터 시작합니다.  

```sql
SELECT SUBSTRING(first_name, 1, 3) FROM employees; -- 앞의 세 글자를 반환
```

## 수 연산

`ABS` 함수는 절대값을 반환합니다.  

```sql
SELECT ABS(-1);
```

`ROUND` 함수는 반올림한 결과를 반환합니다.  

```sql
SELECT ROUND(1.5);
```

## 기타  

CURRENT_DATE 함수는 오늘 날짜를 DATE 형식을 반환합니다. NOW 함수는 현재 시각을 DATETIME 형식으로 반환합니다.  

```sql
SELECT CURRENT_DATE();
SELECT NOW();
```

`COALESCE` 함수는 인자들 중 처음으로 `NULL`이 아닌 값을 반환합니다. 이 함수는 `NULL` 값과 `NULL`이 아닌 값이 모두 저장되어 
있는 컬럼을 불러올 때, `NULL` 값을 대체하기 위해 사용됩니다.

```sql
-- 1이 출력됨
SELECT COALESCE(NULL, 1);

-- 2가 출력됨
SELECT COALESCE(2, 1);

-- 만약 nullable_column에 NULL이 저장되어 있으면 'DEFAULT_VALUE`를 반환하고, 아니면 컬럼에 저장되어있는 값을 그대로 반환
SELECT COALESCE(nullable_column, 'DEFAULT_VALUE') FROM some_table;
```

## FROM, WHERE 구문을 통한 조인

FROM 뒤에 여러 개의 테이블 이름을 적어서, 테이블을 합칠 수 있습니다.  

```sql
SELECT salaries.salary, salaries.from_date, employees.first_name
FROM salaries, employees;
```

이렇게 테이블을 합칠 수 있지만, 뭔가 이상합니다. 모든 사원의 연봉 변동 기록이 같은 것으로 나옵니다. 사실 위 코드는 틀린 코드입니다. 테이블을 `어떻게 합칠 것인지` 지정해주지 않았기 때문에, 결과는 두 테이블의 단순한 Cartesian product(곱집합)으로 나오게 됩니다.  

그러면 테이블을 어떻게 합칠 것인지 지정해보겠습니다.  

```sql
SELECT salaries.salary, salaries.from_date, employees.first_name
FROM salaries, employees
WHERE salaries.emp_no = employees.emp_no;
```

이제야 잘 나오는 것 같습니다. 이렇게 테이블을 합칠 때에는 어떻게 합칠 지를 직접 명시해주어야 합니다. 이렇게 `JOIN` 구문을 사용하지 않고 `FROM`과 `WHERE`만을 사용해 조인하는 것을 `암시적 조인(implicit join)`이라고 합니다.  

## JOIN 구문

위의 예제처럼 테이블을 합칠 수도 있지만, 보통의 경우 `JOIN` 구문을 이용해서 조인을 하는 것이 관례입니다. (조인을 하고 있다는 것을 명확히 알 수 있고, 읽기도 쉽기 때문입니다.) 이렇게 직접 `JOIN` 구문을 사용해서 조인을 하는 것을 `명시적 조인(explicit join)`이라고 합니다. 아래의 예제는 바로 위의 암시적 조인과 완전히 같은 동작을 합니다.  

```sql
SELECT salaries.salary, salaries.from_date, employees.emp_no, employees.first_name
FROM salaries
JOIN employees ON employees.emp_no = salaries.emp_no;
```

FROM에 적었던 두 번째 테이블의 이름을 `JOIN` 바로 뒤에 적어주었습니다. 이렇게 `FROM` 구문으로 지정한 하나의 테이블에 `JOIN` 구문을 사용해서 다른 테이블을 합칠 수 있습니다. 이전에 WHERE를 이용해 적어주었던 기준은 `ON` 구문을 이용해 지정해줍니다.  

`SELECT` 구문 뒤에 오는 컬럼 이름 앞에는 테이블 이름을 `table_name.column_name`과 같은 형식으로 붙여줍니다. 만약 컬럼 이름이 여러 테이블에 걸쳐서 유일하다면 테이블 이름을 아래와 같이 생략할 수 있습니다.  

```sql
-- `emp_no`는 두 테이블 모두 가지고 있기 때문에, 앞에 붙이는 테이블 이름을 생략할 수 없습니다.
SELECT first_name, salary, from_date, employees.emp_no
FROM salaries
JOIN employees ON employees.emp_no = salaries.emp_no;
```

`AS` 구문을 이용해서 테이블 이름에도 별칭을 붙일 수 있습니다.  

```sql
SELECT first_name, salary, from_date, emp.emp_no
FROM salaries AS sal
JOIN employees AS emp ON emp.emp_no = sal.emp_no;
INNER JOIN & OUTER JOIN
```

위의 예제에서 '사원 테이블'과 '연봉 변동 내역 테이블'은 우리의 의도대로 잘 합쳐졌습니다. 그런데 조인의 기준을 충족시키지 못하는 레코드들, 다시 말해서 일치하는 `emp_no가` 없거나, 어느 한 쪽의 `emp_no` 컬럼에 `NULL이` 저장되어 있는 경우는 어떻게 될까요? 위에서 사용한 SQL 명령을 그대로 쓰면, 조인의 기준을 충족시키지 못하는 레코드들은 `아예 출력 결과에 포함이 되지 않습니다.`  

이와 같은 조인 방식을 `INNER JOIN`이라고 합니다. 사실 위 SQL 명령은 다음과 완전히 같은 의미입니다.  

```sql
SELECT first_name, salary, from_date, emp.emp_no
FROM salaries AS sal
INNER JOIN employees AS emp ON emp.emp_no = sal.emp_no;
-- `INNER JOIN`과 `JOIN`은 같은 의미입니다.
```
그런데 가끔, 조인의 기준을 충족시키지 못하는 레코드들도 결과에 포함시켜야 하는 경우가 있습니다. 이러한 조인 방식을 `OUTER JOIN`이라고 합니다. 이 문서에서는 `OUTER JOIN`을 다루지 않으나, 가끔 필요한 경우가 있으니 아래의 문서를 참고해주세요.  

[LEFT OUTER JOIN](https://www.w3schools.com/sql/sql_join_left.asp)  
[RIGHT OUTER JOIN](https://www.w3schools.com/sql/sql_join_right.asp)  
[FULL OUTER JOIN](https://www.w3schools.com/sql/sql_join_full.asp)  

## 세 개 이상의 테이블 조인하기

아래와 같이 `JOIN` 구문을 여러 번 써서, 세 개 이상의 테이블을 합치는 것도 가능합니다.  

```sql
-- departments 테이블에는 부서 번호와 부서 이름이 저장되어 있습니다.
-- dept_emp 테이블에는 사원의 전보 내역이 기록되어 있습니다.
SELECT employees.first_name, dept_emp.from_date, departments.dept_name
FROM employees
JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
JOIN departments ON departments.dept_no = dept_emp.dept_no;
```


SQL에는 쿼리 안에 쿼리를 중첩시켜서 중첩된 쿼리의 결과를 바깥쪽 쿼리에서 활용할 수 있는 기능이 있는데, 이렇게 내부에 `중첩된 쿼리를 서브쿼리`라고 부릅니다.  


## 단일 행 서브쿼리

`단일 행 서브쿼리`는 하나의 행을 반환하는 서브쿼리입니다. 단일 행 서브쿼리는 바깥쪽 쿼리의 `WHERE` 구문에서 비교를 위해 사용될 수 있습니다.  

아래는 '1997년도 이전에 최고 연봉을 받은 사람의 이름'을 구하기 위한 쿼리입니다.  
```sql
SELECT emp_no, first_name FROM employees
WHERE emp_no = (
  SELECT emp_no FROM salaries
  WHERE YEAR(from_date) <= '1997'
  ORDER BY salary DESC
  LIMIT 1
);
``` 
아래와 같이 `튜플`을 사용해서 여러 컬럼을 동시에 비교할 수도 있습니다.  

```sql
-- 튜플을 사용하는 서브쿼리의 예를 보여드리기 위한 쿼리이며, 별 의미는 없습니다.
SELECT emp_no, first_name FROM employees
WHERE (emp_no, first_name) = (
  SELECT emp_no, first_name FROM employees
  LIMIT 1
);
```
## 다중 행 서브쿼리

`다중 행 서브쿼리`는 여러 개의 행을 반환하는 서브쿼리입니다. 다중 행 서브쿼리는 바깥쪽 쿼리의 WHERE 구문에서 IN 연산자와 함께 사용됩니다.  

아래는 최고 연봉 15만 달러를 달성한 적이 있는 사람들의 이름을 가져오기 위한 쿼리입니다.  

```sql
SELECT first_name FROM employees
WHERE emp_no IN (
  SELECT emp_no FROM salaries
  WHERE salary >= 150000
);
```

## 서브쿼리와 조인

서브쿼리로 짠 쿼리를 조인을 이용해서 짤 수 있는 경우도 있습니다. 위의 첫 번째 예제를 조인을 이용해 다시 작성하면 다음과 같이 됩니다.  

```sql
-- '1997년도 이전에 최고 연봉을 받은 사람의 이름'을 구하기 위한 쿼리
SELECT first_name FROM employees
JOIN salaries ON salaries.emp_no = employees.emp_no
WHERE YEAR(salaries.from_date) <= '1997'
ORDER BY salary DESC
LIMIT 1;
```

다만 모든 서브쿼리를 조인으로 대체할 수 있는 것은 아닙니다. 다음과 같이 서브쿼리를 써야만 가능한 쿼리도 있습니다.  

```sql
-- '1997년도 이전의 최고 연봉보다 더 많은 연봉을 받은 사람들의 이름'을 구하기 위한 쿼리
SELECT DISTINCT first_name FROM employees
JOIN salaries ON salaries.emp_no = employees.emp_no
WHERE salary > (
  SELECT salary FROM salaries
  WHERE YEAR(salaries.from_date) <= '1997'
  ORDER BY salary DESC
  LIMIT 1
);
```

같은 작업을 하는 쿼리를 조인으로 짤 수도 있고, 서브쿼리로도 짤 수 있다면 둘 중에 어떤 것을 써야 할까요?  

`IN` 연산자에 들어가는 서브쿼리의 결과가 크면 `연산 속도가 조인에 비해 느려집니다.`  

```sql
-- 0.0021 sec
SELECT first_name FROM employees
WHERE emp_no IN (
  SELECT emp_no FROM salaries
)
LIMIT 1000;
```
```sql
-- 0.00075 sec
SELECT first_name FROM employees
JOIN salaries ON salaries.emp_no = employees.emp_no
LIMIT 1000;
```

대개의 경우, `IN` 연산자에 들어가는 서브쿼리의 길이가 굉장히 긴 (수십 만 행 이상) 경우에는 조인을, 짧은 경우에는 서브쿼리를 사용하는 것이 빠릅니다. 이것을 외우기 귀찮다면, 조인을 쓸 수 있는 상황에서는 조인을 쓰고, 아니라면 서브쿼리를 쓴다고 외워 두어도 무방합니다.  

## 인덱스 생성하기


`CREATE INDEX `구문을 사용해서 인덱스를 생성할 수 있습니다.  

```sql
CREATE INDEX ix_from_date ON salaries(from_date);
```
다중 컬럼 인덱스를 생성할 수도 있습니다.  
```sql
CREATE INDEX ix_from_date_to_date ON salaries(from_date, to_date);
```

## 인덱스 확인하기

앞에서 생성된 인덱스를 `SHOW INDEX` 구문으로 확인할 수 있습니다.

```sql
SHOW INDEX FROM salaries;
```

## Primary Key, Foreign Key

기본 키와 외래 키에 대해서는 자동으로 인덱스가 생성되기 때문에, 별도의 인덱스를 만들어줄 필요가 없습니다.  

## Unique 인덱스

특정 컬럼(혹은 다중 컬럼)의 값을 유일하게 만드는 제약 조건을 걸고 싶을 때 UNIQUE INDEX를 사용합니다.

```sql
CREATE UNIQUE INDEX ix_uniq_column ON table_name(col_name);
```

## 인덱스 제거하기

`DROP INDEX` 구문을 이용해 인덱스를 제거할 수 있습니다.

```sql
DROP INDEX index_name ON table_name;
```

## 인덱스의 설계

인덱스는 테이블과는 별도로 저장됩니다. 즉, 인덱스도 디스크의 용량을 차지합니다. 또한 `미리 정렬을 시켜둬야` 하는 인덱스의 성질때문에, 인덱스를 생성한 뒤에는 데이터의 추가나 수정이 느려집니다. 다시 말해서, 인덱스는 `읽기 효율을 높이는 대신 쓰기 효율을 희생`시킵니다.  

테이블에 쓰기가 극단적으로 많이 일어나는 경우에는 인덱스 사용을 재고해보는 것이 좋습니다. 그렇지 않은 경우라면, `WHERE 혹은 ORDER BY` 구문에서 자주 사용되는 컬럼에 대해서는 인덱스를 걸어두는 것이 좋습니다. 또한 AND 연산으로 엮여서 자주 검색되는 컬럼들에 대해서는 다중 컬럼 인덱스를 생성하는 것이 좋습니다.  

## 실행 계획

작성한 쿼리가 인덱스를 잘 활용하고 있는지 확인하려면 `EXPLAIN` 구문을 사용해서 실행 계획을 확인할 수 있습니다.  

employees 데이터베이스에 대해 여러 쿼리를 작성해 보고, 해당 쿼리의 실행계획을 확인해보세요.  

## 트랜잭션의 필요성

데이터베이스에서는 여러 쿼리에 걸쳐서 데이터를 안전하게 다루기 위해 `트랜잭션이라는` 기능을 사용합니다. 트랜잭션의 필요성을 말씀드리기 위해 간단히 예를 들어보겠습니다.    

한 은행에서 계좌 정보를 관리하기 위해 데이터베이스를 사용하고 있습니다. 한 계좌에서 다른 계좌로 1000원을 옮기기 위해서는, 아래와 같이 데이터베이스에 두 개의 쿼리를 날려야 합니다.  

```sql
-- 첫 번째 쿼리는 'from_account' 계좌에서 1000원을 인출합니다.
UPDATE account
SET balance = balance - 1000
WHERE account_id = 'from_account';
```
```sql
-- 두 번째 쿼리는 'to_account' 계좌에 1000원을 입금합니다.
UPDATE account
SET balance = balance + 1000
WHERE account_id = 'to_account'
```
두 쿼리가 모두 성공적으로 수행된다면, 우리가 처음에 의도했던 작업이 잘 완료됐다고 볼 수 있습니다. 하지만 계좌에 잔액이 부족하거나, 네트워크 오류 혹은 정전 등의 이유로 하나의 쿼리만 실행되고 나머지 하나는 실행이 되지 않는 상황이 발생할 수 있습니다. 즉, 인출은 됐는데 입금이 되지 않은 (혹은 그 반대의) 결과가 나옵니다.  

언제 생길 지 알 수 없는 오류 때문에 데이터를 신뢰할 수 없다면, 은행과 같은 기업의 입장에서는 데이터베이스를 사용할 수 없을 것입니다.  

이렇게 데이터베이스를 다루다 보면 "여러 쿼리에 걸친 데이터 조작의 신뢰성"을 확보할 필요성이 있습니다. 이를 위해 `트랜잭션이라는` 기능을 사용합니다. 트랜잭션을 사용하면, 여러 개의 쿼리 중 하나라도 실패했을 때 데이터베이스의 상태를 `원상복귀` 시킬 수 있습니다.  

## 트랜잭션의 사용

`START TRANSACTION` 구문을 사용하면 현재 커넥션에 대해 트랜잭션이 시작됩니다.  

```sql
START TRANSACTION;
```

트랜잭션을 시작한 다음에는 평소처럼 쿼리를 실행할 수 있습니다.

```sql
INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date)
VALUES (876543, '1980-03-05', 'Georgi', 'Jackson', 'M', '2017-09-11');
```

여러 번의 쿼리를 통해 필요한 작업을 완료한 뒤에는, `COMMIT` 구문으로 현재까지의 변경사항을 데이터베이스에 반영해주어야 합니다.
```sql
COMMIT;
```
만약, 쿼리를 하는 도중에 이제까지 트랜잭션 안에서 했던 모든 작업을 취소하고 싶은 경우에는 `ROLLBACK` 구문을 사용하면 됩니다.
```sql
ROLLBACK;
```

## 트랜잭션의 격리

커밋하기 전에는 트랜잭션 내에서 변경된 사항을 다른 커넥션에서 볼 수 없습니다. (`단, READ COMMITTED 이상의 격리 수준인 경우에 한정`) 이런 성질을 트랜잭션의 `격리(isolation)` 라고 부릅니다. MySQL은 다양한 격리 수준(isolation level)을 지원합니다. 자세한 사항은 공식문서 및 이 글을 참고해주세요.

```sql
-- 위의 INSERT 쿼리를 실행하고 COMMIT을 하지 않은 경우에, 아무 결과도 안 뜹니다.
SELECT * FROM emplyees
WHERE emp_no = 876543;
```

> ACID의 성격에 대해서 알아둬야한다.

## 데이터 모델링

데이터 모델링은 현실 세계의 개념을 데이터베이스의 세계에서 다룰 수 있도록 `재해석하는` 작업을 말합니다.  

데이터 모델링을 하기 위해서는 먼저 모델링의 대상이 되는 현실 세계를 잘 이해할 필요가 있습니다. 이를 위해 데이터 요구사항을 정리하고, 관계자와 인터뷰를 하는 등의 활동을 통해 `현실 세계에서의 작업이 어떤 절차를 통해 이루어지는지`를 자세히 파악해야 합니다.  

이 문서에서는 널리 사용되는 모델링 방법인 개체-관계 모델을 다룰 것입니다. [개체-관계](https://ko.wikipedia.org/wiki/%EA%B0%9C%EC%B2%B4-%EA%B4%80%EA%B3%84_%EB%AA%A8%EB%8D%B8) 모델을 통해 모델링을 할 때에는, 위에서 파악한 절차로부터 아래의 요소들을 이끌어 내게 됩니다.  

`개체 (entity)` : 절차에 관여하는 어떤 것(thing). 식별 가능한 사람, 장소, 사물, 사건 등  
`속성 (attribute)` : 개체가 가지는 성질  
`관계 (relationship)` : 개체 간에 가지는 관계  
데이터베이스에는 각각 아래와 같은 형태로 저장될 수 있습니다.  

개체 - 테이블  
속성 - 개체를 나타내는 테이블의 컬럼  
관계 - 외래 키, 혹은 관계 테이블  

## 관계의 차수(Cardinality)

두 개체 간 관계에서 각 개체의 참여자 수를 차수(cardinality)라고 부릅니다. 차수는 일반적으로 1:1, 1:N, M:N의 세 가지 형태로 분류합니다.  

## 1:1 관계

데이터베이스에서는 1:1 관계에 있는 두 엔티티를 하나의 테이블에 저장하거나, 두 엔티티를 각각 다른 테이블에 저장하고 한 테이블의 기본 키를 다른 테이블에 대한 외래 키로 지정하는 등의 방법을 사용해서 1:1 관계를 표현합니다.  

## 1:N 관계

데이터베이스에서는 1:N 관계에 있는 두 엔티티를 각각 다른 테이블에 저장하고, N 측의 테이블에 다른 테이블에 대한 외래 키를 둬서 1:N 관계를 표현합니다.  

## M:N 관계

데이터베이스에서는 외래 키 하나만 가지고는 M:N 관계를 표현할 수 없으므로, 별도의 관계 테이블을 두고 `관계 테이블`에 두 개의 외래 키를 두는 방법으로 M:N 관계를 표현합니다.  

## 정규화 (Normalization)

정규화란 데이터의 `중복을 최소화`할 수 있도록 데이터를 구조화하는 작업을 말합니다. 일반적으로, 정규화가 잘 된 데이터베이스는 작고 잘 조직된 여러 개의 테이블로 나누어집니다. 예를 들어서, 어떤 학원의 성적 관리 데이터베이스에서는 성적 데이터를 아래와 같이 저장할 수 있을 것입니다.  

정규화를 거치고 나서 테이블이 나뉘어져서 조금 더 복잡해졌지만, 중복되는 데이터가 없어져서 데이터를 관리하기도 쉬워지고 또 데이터가 차지하는 용량도 줄어들었습니다.  

보통 데이터 모델링을 할 때에는 정규화 과정을 통해 중복을 없애주는 것이 좋습니다. 다만 성능상의 이유로 일부러 데이터를 중복시켜 저장하는 경우도 있는데, 이를 반정규화라고 합니다.  

## Entity Relationship Diagram

ERD(Entity Relationship Diagram)은 개체, 속성, 관계를 도표로 나타내는 방법으로, 데이터 모델링의 결과를 시각화하기 위해 널리 사용됩니다. MySQL Workbench을 통해 ERD를 그려볼 수 있습니다.  






