import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    userName = form.getvalue('userName')
    fNameVar = form.getvalue('pass')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE username LIKE (%s) AND password LIKE (%s)', [userName, fNameVar])
    data = cursor.fetchall()
    if data:
        print(f"{json.dumps(data)}")
    else:
        print('{"result" : false}')


try:
    import cgi
    print("Content-type: text/html\n\n")   # say generating html
    outputSQLQuery()
except:
    import cgi
    cgitb.handler()
    cgi.print_exception()