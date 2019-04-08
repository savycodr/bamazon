create database top5000
use top5000
CREATE TABLE top_songs (
  ranking INT NOT NULL,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  year INT NULL,
  raw_total DECIMAL(10,4) NULL,
  raw_usa DECIMAL(10,4) NULL,
  raw_uk DECIMAL(10,4) NULL,
  raw_eur DECIMAL(10,4) NULL,
  raw_row DECIMAL(10,4) NULL,
  PRIMARY KEY (ranking)
);
CREATE TABLE top_albums (
  ranking INT NOT NULL,
  artist VARCHAR(100) NULL,
  album VARCHAR(100) NULL,
  year INT NULL,
  raw_total DECIMAL(10,4) NULL,
  raw_usa DECIMAL(10,4) NULL,
  raw_uk DECIMAL(10,4) NULL,
  raw_eur DECIMAL(10,4) NULL,
  raw_row DECIMAL(10,4) NULL,
  PRIMARY KEY (ranking)
);

-- this will display the artist 
-- and the number of times their songs are in the top 5000
-- It will display in descending order from largest amount of songs
select artist, count(*) as num from top_songs group by artist order by count(*) desc;

-- this will display only those artists with more than one song
select artist, count(*) as num from top_songs group by artist having count(*)>1 order by count(*) desc; 

-- want to see which albums and songs made the top 5000 in the year of album release
select top_albums.year, top_albums.album, top_albums.ranking, top_songs.song, top_albums.artist  
from top_albums
inner join top_songs on (top_albums.artist=top_songs.artist and top_albums.year=top_songs.year)
where top_albums.artist='Eric Clapton' group by artist order by top_albums.year desc ;

-- this is the inner join from solutions
SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist 
FROM top_albums 
INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year= top5000.year) 
WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position;
