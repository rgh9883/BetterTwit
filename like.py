import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    userId = form.getvalue('user')
    post = form.getvalue('post')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM likes WHERE user = (%s) and post = (%s)', [userId, post])
    data = cursor.fetchall()
    if not data:
        cursor.execute("INSERT INTO likes (post, user) VALUES ((%s),(%s))", [post, userId])
        cnxn.commit()
        cursor.execute('SELECT post, count(*) AS numLikes FROM likes WHERE post = (%s) GROUP BY post', [post])
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
    cgi.print_exception()