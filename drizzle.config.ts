// Declarative Drizzle Kit config. The generator is not installed in runtime/CI;
// regenerate migrations only with a separately reviewed patched tooling version.
const drizzleKitConfig={
 dialect:"sqlite",
 schema:"./workers/identity/src/schema.ts",
 out:"./workers/identity/migrations",
 strict:true,
 verbose:false
};
export default drizzleKitConfig;
