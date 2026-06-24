CREATE OR ALTER PROCEDURE dbo.sp_getProjectsFilteredByType
    @projectType NVARCHAR(MAX) = NULL, -- it's varchar but comes as '0' or '1' etc...
    -- General filters
    @page INT = NULL,
    @pageSize INT = NULL,
    @userId INT = NULL,
    @isActive BIT = NULL,
    @countryId INT = NULL,
    @stateId INT = NULL,
    @cityId INT = NULL,
    @status INT = NULL,
    @minPrice INT = NULL,
    @maxPrice INT = NULL,
    @search NVARCHAR(MAX) = NULL,

    -- Particular filters (as provided)
    @type NVARCHAR(MAX) = NULL,
    @minLandArea INT = NULL,
    @maxLandArea INT = NULL,
    @minSizeInAcres FLOAT = NULL,
    @maxSizeInAcres FLOAT = NULL,
    @relationShipWithOwner NVARCHAR(MAX) = NULL,
    @ownersIntention NVARCHAR(MAX) = NULL,
    @suggestedUse NVARCHAR(MAX) = NULL,
    @landAvailable NVARCHAR(MAX) = NULL,
    @segment NVARCHAR(MAX) = NULL,
    @storageIncluded NVARCHAR(MAX) = NULL,
    @serviceType NVARCHAR(MAX) = NULL,
    @ppaContract NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SQL NVARCHAR(MAX);
    DECLARE @TableName NVARCHAR(128);
    DECLARE @WhereClause NVARCHAR(MAX) = N' WHERE p.projectType = @projectType ';

    -- 1. Map type ID to the specific detail table
    SET @TableName = CASE @projectType
        WHEN 0 THEN 'assets' 
        WHEN 1 THEN 'consulting_architectures'
        WHEN 2 THEN 'developments' 
        WHEN 3 THEN 'energy_assets'
        WHEN 4 THEN 'financings' 
        WHEN 5 THEN 'infrastructures'
        WHEN 6 THEN 'natural_resources_developments' 
        WHEN 7 THEN 'natural_resources_financings'
        WHEN 8 THEN 'real_states' 
        ELSE NULL
    END;

    IF @TableName IS NULL RETURN;

    -- 2. Build Dynamic WHERE clause for General Filters
    IF @search IS NOT NULL SET @WhereClause += N' AND (
        p.title LIKE ''%'' + @search + ''%'' OR 
        p.description LIKE ''%'' + @search + ''%'' OR 
        c.name LIKE ''%'' + @search + ''%'' OR 
        s.name LIKE ''%'' + @search + ''%'' OR 
        ct.name LIKE ''%'' + @search + ''%'' OR 
        p.zipCode LIKE ''%'' + @search + ''%'' OR 
        CAST(p.quantity AS NVARCHAR) LIKE ''%'' + @search + ''%''
    ) ';
    IF @userId IS NOT NULL SET @WhereClause += N' AND (p.ownerId = @userId OR p.lawyerId = @userId OR p.approverId = @userId OR p.analystId = @userId)';
    IF @isActive = 1 SET @WhereClause += N' AND (p.projectStatus != 0 OR p.projectStatus != 9) ';
    IF @countryId IS NOT NULL SET @WhereClause += N' AND p.countryId = @countryId ';
    IF @stateId IS NOT NULL SET @WhereClause += N' AND p.stateId = @stateId ';
    IF @cityId IS NOT NULL SET @WhereClause += N' AND p.cityId = @cityId ';
    IF @status IS NOT NULL SET @WhereClause += N' AND p.status = @status ';

    -- this was particularly for assets, but all projects have max min price
    IF @minPrice IS NOT NULL AND @maxPrice IS NOT NULL
    BEGIN
        SET @WhereClause += N' AND (
            (p.minPrice >= @minPrice AND p.minPrice <= @maxPrice) OR 
            (p.maxPrice >= @minPrice AND p.maxPrice <= @maxPrice)
        ) ';
    END
    ELSE IF @minPrice IS NOT NULL
    BEGIN
        SET @WhereClause += N' AND (p.minPrice >= @minPrice OR p.maxPrice >= @minPrice) ';
    END
    ELSE IF @maxPrice IS NOT NULL
    BEGIN
        SET @WhereClause += N' AND (p.minPrice <= @maxPrice OR p.maxPrice <= @maxPrice) ';
    END

    -- 3. Build Dynamic WHERE clause for Particular Filters
    IF @projectType = 0 -- Asset
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.assetType = @type ';
        END
        IF @minLandArea IS NOT NULL AND @maxLandArea IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND (d.landArea >= @minLandArea AND d.landArea <= @maxLandArea) ';
        END
        ELSE IF @minLandArea IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landArea >= @minLandArea ';
        END
        ELSE IF @maxLandArea IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landArea <= @maxLandArea ';
        END
    END
    ELSE IF @projectType = 1 -- ConsultingArchitecture
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.projectSubtype = @type ';
        END
        IF @serviceType IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.serviceType = @serviceType ';
        END
        IF @landAvailable IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landAvailable = @landAvailable ';
        END
    END 
    ELSE IF @projectType = 2 -- Development
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.developmentSubtype = @type ';
        END
        IF @landAvailable IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landAvailable = @landAvailable ';
        END
    END 
    ELSE IF @projectType = 3 -- EnergyAsset
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.infrastructureType = @type ';
        END
        IF @segment IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.segment = @type ';
        END
        IF @ppaContract IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.ppaContract = @ppaContract ';
        END
        IF @storageIncluded IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.storageIncluded = @storageIncluded ';
        END
    END 
    ELSE IF @projectType = 4 -- Financing
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.projectSubtype = @type ';
        END
        IF @landAvailable IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landAvailable = @landAvailable ';
        END
    END 
    ELSE IF @projectType = 5 -- Infrastructure
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.infrastructureType = @type ';
        END
        IF @segment IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.segment = @type ';
        END
    END 
    -- does not contain particular filters
    -- ELSE IF @projectType = 6 -- NaturalResourcesDevelopment
    -- BEGIN
    -- END 
    -- ELSE IF @projectType = 7 -- NaturalResourcerFinancing
    -- BEGIN
    -- END 
    ELSE IF @projectType = 8 -- RealState
    BEGIN
        IF @type IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.realStateType = @type ';
        END
        IF @minLandArea IS NOT NULL AND @maxLandArea IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND (d.landArea >= @minLandArea AND d.landArea <= @maxLandArea) ';
        END
        ELSE IF @minLandArea IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landArea >= @minLandArea ';
        END
        ELSE IF @maxLandArea IS NOT NULL
        BEGIN
            SET @WhereClause += N' AND d.landArea <= @maxLandArea ';
        END
        IF @relationShipWithOwner IS NOT NULL AND @relationShipWithOwner <> ''
        BEGIN
            SET @WhereClause += N' AND d.relationShipWithOwner = @relationShipWithOwner ';
        END
        IF @ownersIntention IS NOT NULL AND @ownersIntention <> ''
        BEGIN
            SET @WhereClause += N' AND d.ownersIntention = @ownersIntention ';
        END

        -- need to check STRING_SPLIT according sql version
        -- IF @suggestedUse IS NOT NULL AND @suggestedUse <> ''
        -- BEGIN
        --     SET @WhereClause += N' AND EXISTS (
        --         SELECT 1 
        --         FROM STRING_SPLIT(@suggestedUse, '','') s 
        --         WHERE d.suggestedUse LIKE ''%'' + s.value + ''%''
        --     ) ';
        -- END
    END 

    -- 4. Construct the Dynamic SQL
    SET @SQL = N'
    ;WITH ProjectData AS (
        SELECT 
            p.*,
            totalCount = COUNT(*) OVER(),
            details = (SELECT d.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM projects p
        INNER JOIN ' + QUOTENAME(@TableName) + N' d ON p.id = d.projectId ' 
        + @WhereClause + N'
    )
    SELECT * FROM ProjectData
    ORDER BY createdAt DESC';

    -- 5. Add Pagination
    DECLARE @EffPage INT = ISNULL(@page, 1);
    DECLARE @EffSize INT = ISNULL(@pageSize, 0);

    IF @EffSize > 0
        SET @SQL += N' OFFSET (@EffPage - 1) * @EffSize ROWS FETCH NEXT @EffSize ROWS ONLY;';

    -- 6. Execute with all parameters
    EXEC sp_executesql @SQL, 
        N'@projectType INT, 
          @userId INT, 
          @countryId INT, 
          @stateId INT, 
          @cityId INT, 
          @status INT, 
          @minPrice INT, 
          @maxPrice INT, 
          @search NVARCHAR(MAX),
          @minLandArea INT, 
          @maxLandArea INT,
          @type NVARCHAR(MAX),
          @relationShipWithOwner NVARCHAR(MAX),
          @ownersIntention NVARCHAR(MAX),
          @serviceType NVARCHAR(MAX),
          @landAvailable NVARCHAR(MAX),
          @ppaContract NVARCHAR(MAX),
          @storageIncluded NVARCHAR(MAX),
          @EffPage INT, 
          @EffSize INT',
        @projectType, 
        @userId, 
        @countryId, 
        @stateId, 
        @cityId, 
        @status, 
        @minPrice, 
        @maxPrice, 
        @search,
        @minLandArea, 
        @maxLandArea,
        @type,
        @relationShipWithOwner,
        @ownersIntention,
        @serviceType,
        @landAvailable,
        @ppaContract,
        @storageIncluded,
        @EffPage, 
        @EffSize;
END