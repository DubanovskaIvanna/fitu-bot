use [fitu-bot-db]
go

IF OBJECT_ID('dbo.Users') is not null
BEGIN
	DROP TABLE dbo.Users
END
GO

IF OBJECT_ID('dbo.Exercises') is not null
BEGIN
	DROP TABLE dbo.Exercises
END
GO

IF OBJECT_ID('dbo.Questions') is not null
BEGIN
	DROP TABLE dbo.Questions
END
GO

CREATE TABLe dbo.Questions
(
	[Identity] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	ID INT NOT NULL,
	ParentID INT NULL,
	Question NVARCHAR(MAX) NOT NULL,
	TypeOfSet INT NULL,
	AdditionSet INT NULL,
	WorkType NVARCHAR(MAX) NULL,
	AgeRange NVARCHAR(MAX) NULL,
	Intensity NVARCHAR(MAX) NULL,
	Sex NVARCHAR(MAX) NULL,
	Iterations NVARCHAR(MAX) NULL,
	Times INT NULL,
	SpineDepartment NVARCHAR(MAX) NULL,
	ImageURL NVARCHAR(MAX) NULL,
	CreatedAt DATETIMEOFFSET NOT NULL DEFAULT GETDATE(), 
	UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE dbo.Exercises
(
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Exercise NVARCHAR(MAX) NULL,
	ImageURL NVARCHAR(MAX) NULL,
	CreatedAt DATETIMEOFFSET NOT NULL DEFAULT GETDATE(), 
	UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT GETDATE(),
)

CREATE TABLE dbo.Users
(
	ID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	ChatId NVARCHAR(MAX) NULL,
	TypeOfSet INT NULL,
	AdditionSet INT NULL,
	WorkType NVARCHAR(MAX) NULL,
	AgeRange NVARCHAR(MAX) NULL,
	Intensity NVARCHAR(MAX) NULL,
	Sex NVARCHAR(MAX) NULL,
	Iterations NVARCHAR(MAX) NULL,
	Times INT NULL,
	SpineDepartment NVARCHAR(MAX) NULL,
	ImageURL NVARCHAR(MAX) NULL,
	LastQuestionId INT NULL,
	CreatedAt DATETIMEOFFSET NOT NULL DEFAULT GETDATE(), 
	UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT GETDATE(),
	CONSTRAINT FK_QUESTIONS FOREIGN KEY (LastQuestionId) REFERENCES dbo.Questions([Identity]),
	CONSTRAINT FK_EXCERCISES_1 FOREIGN KEY (TypeOfSet) REFERENCES dbo.Exercises(ID),
	CONSTRAINT FK_EXCERCISES_2 FOREIGN KEY (AdditionSet) REFERENCES dbo.Exercises(ID)
)

