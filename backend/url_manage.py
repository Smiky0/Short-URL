from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from database_connection import get_connection
from convert_tobase62 import to_base62

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_database():
	try:
		con = get_connection()
		cursor = con.cursor()
		cursor.execute("create table temp (id BIGSERIAL primary key, short_url varchar(10) unique not null, long_url text not null, created_at timestamp default current_timestamp);")
		con.commit()
		error = False
	except:
		error = True
	finally:
		cursor.close()
		con.close()
	return error

def update_database( long_url:str):
	try:
		con = get_connection()
		cursor = con.cursor()
		short_url="a"
		cursor.execute("INSERT INTO temp (short_url, long_url) VALUES (%s, %s) RETURNING id;",(short_url, long_url,))
		row_id = cursor.fetchone()[0]

		short_url = to_base62(row_id + 100000)

		cursor.execute(
			"UPDATE temp SET short_url = %s WHERE id = %s;",
			(short_url, row_id)
		)
		con.commit()
		return short_url
	except:
		return "coookedd"
	finally:
		cursor.close()
		con.close()
	
def find_short_url(short_url: str):
	try:
		con = get_connection()
		cursor = con.cursor()
		cursor.execute("select long_url from temp where short_url=%s",(short_url,))
		long_url = cursor.fetchone()

		return long_url[0] if long_url else None 
	except:
		return "coookedd"
	finally:
		cursor.close()
		con.close()

@app.get('/')
async def hello_world():
	return {"message": "HELLLOWWW!!"}

@app.get("/urls/shorten/{long_url:path}")
async def shorten_path(long_url: str ):
	# print(long_url)
	short_url = update_database(long_url)
	# res = to_base62(num)
	# dt = create_database()
	
	return {"http://localhost:8000/"+short_url}


@app.get("/{short_url}")
async def find_url(short_url):
	res = find_short_url(short_url)
	# if no match found show error
	if res is None:
		raise HTTPException(status_code=404, detail="URL doesn't exist anymore.")
	# if match found, redirect (using 302 to count clicks in future)
	return RedirectResponse(url=res, status_code=302)