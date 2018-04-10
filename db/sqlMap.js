var sqlMap = {
    // 用户
    food: {
        add: 'insert into  food (id, title, img, type) values(0, ?, ?, ?)',
        del: 'delete from food where type = ?'
    },
    quest: {
        add: 'insert into  question (id, question, joins) values(0, ?, ?)',
        del: 'delete from question '
    },
    search: {
        add: 'insert into  search (id, num, name, status) values(0, ?, ?, ?)',
        del: 'delete from search '
    }
}
module.exports = sqlMap;
