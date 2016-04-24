
import T from 'typr'
// import assert from 'assert'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.DefaultRenderingPlugin
const DefaultTree = RenderingPlugin.get_class('Tree')



// const context = 'plugins/backend-foundation6/plugin/tree'


export default class Tree extends DefaultTree
{
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.$settings = T.isObject(this.$settings) ? this.$settings : {}
	   
		const scripts_urls = [
			'plugins/Foundation-6/jquery.min.js',
			'plugins/Foundation-6/foundation.js']
		this.add_scripts_urls(scripts_urls)
		
		const styles_urls = [
			'plugins/Foundation-6/foundation.min.css']
		this.add_styles_urls(styles_urls)
		
		// console.log('foundation6.tree.$settings', this.$settings)
		
		this.set_css_classes_for_tag('tree', 'f6_tree', false)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		// console.log('foundation6.tree.get_initial_state')
		
		return {
			headers: [],
			items: [],
			
			label:'no label'
		}
	}
}
