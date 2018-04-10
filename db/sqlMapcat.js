var sqlMap = {
    cat: {
        add: 'insert into  cat (id, title, img,likes,commonts,views) values(0, ?, ?, ?, ?, ? )'
    }
}
module.exports = sqlMap;
