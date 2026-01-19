
import adminJs from "../admin/admin.js";

const bundle = async () => {
    console.log('Bundling AdminJS assets...');
    try {
        await adminJs.initialize();
        console.log('AdminJS bundling complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error bundling AdminJS:', error);
        process.exit(1);
    }
};

bundle();
