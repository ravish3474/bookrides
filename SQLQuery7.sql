declare @start datetime
declare @end datetime
declare @total_days varchar(100)

set @start = '2020-08-26'

set @end=(SELECT CONVERT(datetime,GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time',1))
set @total_days=(select DATEDIFF(d, @end,@start))
print @total_days
SELECT supplier_id FROM suppliers WHERE advance_days >= @total_days