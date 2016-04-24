
// import T from 'typr'
// import assert from 'assert'

// import DefaultTable from '../../../common/rendering/default/table'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.DefaultRenderingPlugin
const DefaultTable = RenderingPlugin.get_class('Table')


// const context = 'plugins/backend-foundation6/plugin/table'


export default class Table extends DefaultTable
{
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.set_css_classes_for_tag('table', 'f6_table', false)
		
		const scripts_urls = [
			'plugins/Foundation-6/jquery.min.js',
			'plugins/Foundation-6/foundation.js']
		this.add_scripts_urls(scripts_urls)
		
		const styles_urls = [
			'plugins/Foundation-6/foundation.min.css']
		this.add_styles_urls(styles_urls)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
            
			label:'no label'
		}
	}
}
