const {User_group, User, Group, sequelize} = require('../configs/sequelize/models');
const {QueryTypes} = require('sequelize');


module.exports = {

    async get(req, res, next) {
        const groups = await Group.findAll({order: ['id']});

        if(groups === null) return res.status(404).json({error: 'No existen grupos'});
        return res.json(groups);
    },

    async getUserGroup(req, res, next) {
        const user_id = req.body.logged_user.id;
        const query = 
        `
            SELECT ug.id AS id, g.id AS group_id, start_time, end_time
            FROM \`groups\` g
            INNER JOIN users_groups ug ON g.id = ug.group_id
            WHERE ug.user_id = :user_id
        `;
        const user_group = await sequelize.query(query, {replacements: {user_id}, type: QueryTypes.SELECT});

        if(user_group.length === 0) return res.status(404).json({error: 'El usuario no pertenece a ningún grupo'});
        return res.json(user_group[0]);
    },

    async getUsersGroup(req, res, next) {
        const users_groups = await User_group.findAll({
            attributes: ['id'],
            include: [
                {model: Group, as: 'group'},
                {model: User, as: 'user', attributes: ['id', 'username']}
            ],
            order: [[{model: Group, as: 'group'}, 'id']],
        });

        if(users_groups.length === 0) return res.status(404).json({error: 'No está lleno ningún grupo'});

        // Arranging the array
        const arrayArranged = [];
        let currentGroupId = null;

        users_groups.forEach(user_group => {
            const relation = {
                id: user_group.id,
                user: user_group.user
            };
            const group = {
                group_id: user_group.group.id,
                start_time: user_group.group.start_time,
                end_time: user_group.group.end_time,
                relations: [relation]
            };

            if(currentGroupId === user_group.group.id) arrayArranged[arrayArranged.length - 1].relations.push(relation);
            else arrayArranged.push(group);
            
            currentGroupId = user_group.group.id;
        });

        return res.json(arrayArranged);
    },

    async set(req, res, next) {
        const {user_id, group_id} = req.body;
        
        const user = await User.findByPk(user_id);
        const group = await Group.findByPk(group_id);

        if(!user || !group) return res.status(400).json({error: 'Ingresa un usuario y grupo correcto'});
        
        const [user_group, created] = await User_group.findOrCreate({where: {user_id}, defaults: {user_id, group_id}});
        if(created) return res.status(201).json({message: 'Relación creada'});
    
        user_group.group_id = group_id;
        if(req.body.status) user_group.status = req.body.status;
        await user_group.save()
        .then(r => res.status(201).json({message: 'Relación actualizada'}))
        .catch(e => next(e));
    },

    async delete(req, res) {
        const user_group = await User_group.findByPk(req.params.id);
        if(user_group === null) return res.status(404).json({error: 'Elemento no encontrado'});
        await user_group.destroy();
        return res.json({message: 'Elemento borrado con éxito'});
    }

}