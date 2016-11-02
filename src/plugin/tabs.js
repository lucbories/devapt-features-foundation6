
import T from 'typr'
import assert from 'assert'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.DefaultRenderingPlugin
const DefaultTabs = RenderingPlugin.get_class('Tabs')
// const DefaultComponent = Devapt.Component


const context = 'plugins/backend-foundation6/plugin/tabs'


export default class Tabs extends DefaultTabs
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Tabs.normalize_settings(arg_settings)
		arg_settings.scripts_urls = arg_settings.scripts_urls.concat(
			[
				'plugins/Foundation-6/jquery.min.js',
				'plugins/Foundation-6/foundation.js'
			]
		)
		arg_settings.styles_urls = arg_settings.styles_urls.concat(
			['plugins/Foundation-6/foundation.min.css']
		)
		
		super(arg_name, arg_settings)
	}
	
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			items: [],
            
			label:'no tabs label'
		}
	}
	
	
	
	/**
	 * Render component main rendering.
	 * 
	 * @returns {string} rendered html string
	 */
	render_main()
	{
		// console.log(this.state, context + ':render:state')
		
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isArray(this.state.items), context + ':bad state items array')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		// const label = T.isString(this.state.label) ? this.state.label : undefined
		
		
		// BUILD HTML ELEMENT
		const html_id = 'id="' + this.get_dom_id() + '"'
		const html_titles_id = 'id="' + this.get_dom_id() + '_titles"'
		const html_contents_id = 'id="' + this.get_dom_id() + '_contents"'
		const html_contents_target_id = 'data-tabs-content="' + this.get_dom_id() + '_titles"'
		
		const html_css_vertical = this.state.has_vertical ? ' vertical' : ''
		const html_css_class_titles = `class="f6_tabs_titles tabs ${html_css_vertical}"`
		const html_css_class_contents = `class="f6_tabs_contents tabs-content ${html_css_vertical}"`
		
		
		// BUILD HTML TABS
		let html_tabs_titles = ''
		let html_tabs_contents = ''
		
		this.state.items.forEach(
			(tab_cfg, index) => {
				if ( T.isObject(tab_cfg) && T.isString(tab_cfg.label) )
				{
					const tab_label_id = this.get_name() + '_tab_label_' + index
					const tab_content_id = this.get_name() + '_tab_content_' + index
					
					const tab_is_active = (index == 0) ? 'is-active' : ''
					const tab_is_active_aria = (index == 0) ? 'aria-selected="true"' : ''
					const tab_label_id_str = 'id="' + tab_label_id + '"'
					const tab_label_value = tab_cfg.label ? tab_cfg.label : '- ' + index + ' -'
					html_tabs_titles += `<li ${tab_label_id_str} class="tabs-title ${tab_is_active}"> <a href="#${tab_content_id}" ${tab_is_active_aria}>${tab_label_value}</a></li>\n`
					
					const tab_content_value = this.render_item_content(tab_cfg)
					const tab_content_id_str = 'id="' + tab_content_id + '"'
					html_tabs_contents += `\n<div ${tab_content_id_str} class="tabs-panel ${tab_is_active}">\n ${tab_content_value} \n</div>\n`
				}
			}
		)
		
		const html_titles = `<ul ${html_titles_id} ${html_css_class_titles} data-tabs>${html_tabs_titles}</ul>`
		const html_contents = `<div ${html_contents_id} ${html_css_class_contents} ${html_contents_target_id}>${html_tabs_contents}</div>`
		
		if (this.state.has_vertical)
		{
			return `\n<div ${html_id}>\n<div class="row collapse">\n<div class="medium-2 columns">\n${html_titles}\n</div>\n<div class="medium-10 columns">\n${html_contents}\n</div>\n</div>\n</div>\n`
		}
		return `\n<div ${html_id}>\n${html_titles}\n${html_contents}\n</div>\n`
	}
}
