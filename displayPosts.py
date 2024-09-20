import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    maxPosts = form.getvalue('maxPosts')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT id, postId, username, imagePost, textPost, CAST(timeOfPost AS char) AS time, COUNT(postId=post) AS numLikes FROM users JOIN posts LEFT JOIN likes ON postId = post WHERE userId = id AND postId <= (%s) GROUP BY postId ORDER BY postId DESC LIMIT 10', [maxPosts])
    data2 = cursor.fetchall()
    print(f"{json.dumps(data2)}")



try:
    import cgi
    print("Content-type: text/html\n\n")   # say generating html
    outputSQLQuery()
except:
    import cgi
    cgitb.handler()
    cgi.print_exception()