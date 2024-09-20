import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    userId = form.getvalue('userId')
    post = form.getvalue('postText')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE id = (%s)', [userId])
    data = cursor.fetchall()
    if data:
        cursor.execute("INSERT INTO posts (userId, textPost) VALUES ((%s),(%s))", [userId, post])
        cnxn.commit()
        cursor.execute('SELECT id, postId, username, imagePost, textPost, CAST(timeOfPost AS char) AS time, COUNT(postId=post) AS numLikes FROM users JOIN posts LEFT JOIN likes ON postId = post WHERE userId = id group by postId order by postId DESC LIMIT 10')
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