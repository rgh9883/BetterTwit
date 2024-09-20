import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    userId = form.getvalue('user')
    currentUser = form.getvalue('currentUser')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM follow_table WHERE followerId = (%s) AND followingId = (%s)', [currentUser, userId])
    data = cursor.fetchall()
    if not data:
        cursor.execute("INSERT INTO follow_table (followerId, followingId) VALUES ((%s),(%s))", [currentUser, userId])
        cnxn.commit()
        cursor.execute('SELECT id, username, COUNT(followingId = id) AS Followers, tempTable.Following AS Following FROM users LEFT JOIN follow_table ON followingId = id JOIN (SELECT COUNT(*) AS Following FROM follow_table LEFT JOIN users ON followerId = id WHERE id = (%s)) AS tempTable WHERE id = (%s)', [userId, userId])
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