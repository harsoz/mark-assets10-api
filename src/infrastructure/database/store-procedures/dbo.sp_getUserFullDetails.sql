CREATE OR ALTER PROCEDURE dbo.sp_getUserFullDetails
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM Users WHERE Id = @UserId;

    SELECT DF.*
    FROM DynamicFields DF
    JOIN Definitions D ON DF.DefinitionId = D.Id
    WHERE DF.UserId = @UserId;

    SELECT * FROM Roles WHERE UserId = @UserId;

    SELECT PE.*
    FROM ProfessionalExperience PE
    LEFT JOIN Countries C ON PE.CountryId = C.Id
    WHERE PE.UserId = @UserId;

    SELECT * FROM Education WHERE UserId = @UserId;

    SELECT P.* FROM Projects P
    WHERE P.OwnerId = @UserId 
      AND P.Status NOT IN ('Closed', 'Cancelled');
END