// models/project.js
const pool = require('../db');

const Project = {
    async create(project) {
        const result = await pool.query(
            'INSERT INTO projects (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
            [project.title, project.description, project.owner_id]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query('SELECT * FROM projects');
        return result.rows;
    },

    async joinProject(project_id, user_id) {
        const result = await pool.query(
            'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) RETURNING *',
            [project_id, user_id]
        );
        return result.rows[0];
    },

    async findByUserId(user_id) {
        const result = await pool.query(
            'SELECT p.* FROM projects p INNER JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = $1',
            [user_id]
        );
        return result.rows;
    }
};

module.exports = Project;
