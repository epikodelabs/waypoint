import path from 'node:path';
import { createBuilder, targetFromTargetString, type BuilderContext, type BuilderOutput } from '@angular-devkit/architect';
import { compile, plan, planHostEntry, emitHostEntry, createBuildLayout } from '../../compiler/src/lib/index.js';

interface Options { readonly buildTarget: string; readonly entry?: string; readonly routesExport?: string; readonly profile?: boolean; }

async function execute(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  try {
    const root=context.workspaceRoot;
    const target=targetFromTargetString(options.buildTarget);
    const metadata=await context.getProjectMetadata(target.project);
    const projectRoot=typeof metadata['root']==='string'?metadata['root']:'';
    const baseOptions=await context.getTargetOptions(target);
    const layout=createBuildLayout(resolveOutputPath(root,baseOptions['outputPath']));
    const entry=path.resolve(root,projectRoot,options.entry??'src/app/app.routes.ts');
    const compilerOptions={entry,serverOutput:layout.serverRoot,entriesOutput:layout.entriesRoot,manifestOutput:layout.manifest,artifactsOutput:layout.protectedRoot,routesExport:options.routesExport,profile:options.profile};

    const planned=await plan(compilerOptions);
    report(planned.diagnostics,context);
    if(!planned.success||!planned.plan)return{success:false,error:'Waypoint planning failed.'};

    const generatedHost=planHostEntry(planned.plan,path.join(layout.metadataRoot,'host','app.routes.ts'));
    await emitHostEntry(generatedHost);

    const replacements=normalizeReplacements(baseOptions['fileReplacements']);
    replacements.push({replace:entry,with:generatedHost.outputPath});

    const scheduled=await context.scheduleTarget(target,{fileReplacements:replacements});
    try{const angular=await scheduled.result;if(!angular.success)return angular;}finally{await scheduled.stop();}

    const compiled=await compile(compilerOptions);
    report(compiled.diagnostics,context);
    return compiled.success?{success:true}:{success:false,error:'Waypoint protected build failed.'};
  }catch(error){const message=error instanceof Error?error.message:String(error);context.logger.error(message);return{success:false,error:message};}
}

function normalizeReplacements(value:unknown):Array<{replace:string;with:string}>{
 if(!Array.isArray(value))return[];
 return value.flatMap(item=>item&&typeof item==='object'&&typeof (item as any).replace==='string'&&typeof (item as any).with==='string'?[{replace:(item as any).replace,with:(item as any).with}]:[]);
}
function resolveOutputPath(root:string,value:unknown):string{
 if(typeof value==='string'&&value)return path.resolve(root,value);
 if(value&&typeof value==='object'&&typeof (value as any).base==='string')return path.resolve(root,(value as any).base);
 throw new Error('Underlying Angular target must define outputPath.');
}
function report(items:readonly {level:string;code?:string;message:string}[],context:BuilderContext):void{for(const item of items){const text=item.code?`${item.code}: ${item.message}`:item.message;if(item.level==='error')context.logger.error(text);else if(item.level==='warning')context.logger.warn(text);else context.logger.info(text);}}
export default createBuilder<Options>(execute);
