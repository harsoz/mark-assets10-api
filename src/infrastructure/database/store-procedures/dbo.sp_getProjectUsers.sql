CREATE OR ALTER PROCEDURE dbo.sp_getProjectUsers
    @ProjectId varchar(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT U.* -- we should select necessary fields
    FROM Users U
    INNER JOIN Projects P ON 
        U.Id = P.OwnerId OR 
        U.Id = P.ApproverId OR 
        U.Id = P.LawyerId
    WHERE P.Id = @ProjectId;
END