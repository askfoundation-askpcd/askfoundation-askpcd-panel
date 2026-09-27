import askpcdoctor from "./askpcdoctor.js";

const modules = {
    askpcdoctor
};

export function getActiveModuleComponent(currentModuleKey) {
    const mod = modules[currentModuleKey] || modules.askpcdoctor;
    return mod.component;
}
