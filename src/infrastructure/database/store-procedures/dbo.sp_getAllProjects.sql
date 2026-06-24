CREATE OR ALTER PROCEDURE dbo.sp_getAllProjects
    @page INT = NULL,
    @pageSize INT = NULL,
    -- Filter parameters
    @type NVARCHAR(MAX) = NULL,
    @countryId INT = NULL,
    @stateId INT = NULL,
    @cityId INT = NULL,
    @status INT = NULL,
    @minPrice INT = NULL,
    @maxPrice INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Normalize pagination parameters
    DECLARE @EffPage INT = ISNULL(@page, 1);
    DECLARE @EffSize INT = ISNULL(@pageSize, 0);

    -- 1. Insert into temp table applying all filters
    SELECT 
        p.*,
        totalCount = COUNT(*) OVER(),
        details = CASE 
            WHEN p.projectType = 0 THEN (SELECT * FROM assets WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 1 THEN (SELECT * FROM consulting_architectures WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 2 THEN (SELECT * FROM developments WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 3 THEN (SELECT * FROM energy_assets WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 4 THEN (SELECT * FROM financings WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 5 THEN (SELECT * FROM infrastructures WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 6 THEN (SELECT * FROM natural_resources_developments WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 7 THEN (SELECT * FROM natural_resources_financings WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            WHEN p.projectType = 8 THEN (SELECT * FROM real_states WHERE projectId = p.id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
            ELSE NULL
        END
    INTO #ProjectTemp 
    FROM projects p
    WHERE 
        (@countryId IS NULL OR p.countryId = @countryId)
        AND (@stateId IS NULL OR p.stateId = @stateId)
        AND (@cityId IS NULL OR p.cityId = @cityId)
        AND (@status IS NULL OR p.status = @status)
        -- Complex range logic for Price
        AND (@minPrice IS NULL OR p.minPrice >= @minPrice OR p.maxPrice >= @minPrice)
        AND (@maxPrice IS NULL OR p.minPrice <= @maxPrice OR p.maxPrice <= @maxPrice)
        -- Handle comma-separated type filter
        AND (@type IS NULL OR p.projectType IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@type, ',')));

    -- 2. Final selection with conditional pagination
    IF @EffSize > 0
    BEGIN
        SELECT * FROM #ProjectTemp
        ORDER BY createdAt DESC
        OFFSET (@EffPage - 1) * @EffSize ROWS
        FETCH NEXT @EffSize ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT * FROM #ProjectTemp
        ORDER BY createdAt DESC;
    END

    -- Clean up temp table
    DROP TABLE #ProjectTemp;
END

select * from projects