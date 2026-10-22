import type {presets} from "./presets";
export const siteConfig={
 name:"__BRAND_NAME__",
 project:"__PROJECT_NAME__",
 description:"Website của __BRAND_NAME__.",
 template:"__TEMPLATE_SLUG__",
 variant:"__TEMPLATE_VARIANT__" as keyof typeof presets,
 templateVersion:"__TEMPLATE_VERSION__",
 contactEmail:__CONTACT_EMAIL_JSON__,
 enabledModules:__MODULES_JSON__ as readonly string[],
};
