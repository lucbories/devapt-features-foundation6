
// import T from 'typr'
// import assert from 'assert'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.DefaultRenderingPlugin
const DefaultTree = RenderingPlugin.get_class('Tree')



// const context = 'plugins/backend-foundation6/plugin/tree'


export default class Tree extends DefaultTree
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Tree.normalize_settings(arg_settings)
		arg_settings.scripts_urls = arg_settings.scripts_urls.concat(
			[
				'plugins/Foundation-6/jquery.min.js',
				'plugins/Foundation-6/foundation.js'
			]
		)
		arg_settings.styles_urls = arg_settings.styles_urls.concat(
			['plugins/Foundation-6/foundation.min.css']
		)
		arg_settings.css.classes_by_tag['tree'] += ' f6_tree'
		
		super(arg_name, arg_settings)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		// console.log('foundation6.tree.get_initial_state')
		
		return {
			headers: [],
			items: [],
			tree: {},
			label:'no label'
		}
	}
}
