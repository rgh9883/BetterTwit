import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    userName = form.getvalue('userName')
    passVar = form.getvalue('pass')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE username = (%s)', [userName])
    data = cursor.fetchall()
    if not data:
        cursor.execute("INSERT INTO users (username, password) VALUES ((%s),(%s))", [userName, passVar])
        cnxn.commit()
        cursor.execute('SELECT * FROM users WHERE userName = (%s)', [userName])
        data2 = cursor.fetchall()
        print(f"{json.dumps(data2)}")
    else:
        print('{"result" : false}')



try:
    import cgi
    print("Content-type: text/html\n\n")   # say generating html
    outputSQLQuery()
except:
    import cgi
    cgitb.handler()
    cgi.print_exception()                 # catch and print errors
