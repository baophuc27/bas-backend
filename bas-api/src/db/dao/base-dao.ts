import { Model, Op } from 'sequelize';

async function updateModel<T extends Model>(
    model: any,
    id: string | number,
    updates: any,
    transaction?: any
): Promise<T | null> {
    // Find the model instance by ID
    const instance = await model.findByPk(id);

    if (!instance) {
        return null;
    }

    // Update the model instance with the new values
    await instance.update(updates, { transaction });

    // Return the updated model instance
    return instance;
}

async function getOneModel<T extends Model>(model: any, id: number | string): Promise<T | null> {
    return await model.findOne({
        where: {
            id,
            deletedAt: {
                [Op.eq]: null,
            },
        },
    });
}

async function getAllModel<T extends Model>(model: any): Promise<T | null> {
    return await model.findAll();
}

async function deleteModel<T extends Model>(
    model: any,
    id: number | string,
    transaction?: any
): Promise<T | null> {
    // Find the model instance by ID
    const instance = await model.findByPk(id);

    if (!instance) {
        return null;
    }

    // Update the model instance with the new values
    return await instance.destroy();
}

export { updateModel, getOneModel, deleteModel, getAllModel };
