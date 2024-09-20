import cgitb
cgitb.enable()

def outputSQLQuery():
    import json
    import mysql.connector
    form = cgi.FieldStorage()
    maxPosts = form.getvalue('maxPosts')
    userId = form.getvalue('userId')

    cnxn = mysql.connector.connect(user='admin', password='ThisIsAPlaceHolder', host='ThisIsAPlaceHolder.rds.amazonaws.com', database='db_schema')
    cursor = cnxn.cursor(dictionary=True)
    cursor.execute('SELECT id, postId, username, imagePost, textPost, CAST(timeOfPost AS char) AS time, COUNT(postId=post) AS numLikes from users JOIN posts LEFT JOIN likes ON postId = post JOIN follow_table WHERE userId = id AND postId <= (%s) AND followingId = id AND followerId = (%s) GROUP BY postId ORDER BY postId DESC LIMIT 10', [maxPosts, userId])
    data2 = cursor.fetchall()
    if data2:
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