
import T from 'typr'
import assert from 'assert'

import Devapt from 'devapt'

const Component = Devapt.Component
const runtime = Devapt.runtime


const context = 'plugins/backend-foundation6/plugin/menubar'


export default class Menubar extends Component
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Component.normalize_settings(arg_settings)
		arg_settings.scripts_urls = arg_settings.scripts_urls.concat(
			[
				'plugins/Foundation-6/jquery.min.js',
				'plugins/Foundation-6/foundation.js'
			]
		)
		arg_settings.styles_urls = arg_settings.styles_urls.concat(
			['plugins/Foundation-6/foundation.min.css']
		)
		arg_settings.scripts.push('$(document).ready( function(){ var menubar = $("#' + arg_name + '");/* menubar.foundation();*/ menubar.show() } )') 
		
		super(arg_name, arg_settings)
		
		this.$type = 'Menubar'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			items: [],
			label: 'Home'
		}
	}
	
	
	// RENDERING
	render_main()
	{
		// console.log('Foundation6:Menubar.render:state',this.state)
		
		// console.log(this.state, 'state2')
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isArray(this.state.items), context + ':bad state items array')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		const state = this.get_state()
		
		// BUILD HTML ROWS
		let html_left_menus = ''
		for(let i = 0 ; i < this.state.items.length ; i++)
		{
			const row = this.state.items[i]
			
			if ( T.isArray(row.items) )
			{
				let html_row = '<a href="#">' + row.label + '</a>'
				html_row += '<ul class="submenu menu vertical" data-submenu>'
				for(let j = 0 ; j < row.items.length ; j++)
				{
					const sub_row = row.items[j]
					const url = runtime.context.get_url_with_credentials(state.app_url + sub_row.url, this.renderer.request)
					const sub_html_row =  '<a href="/' + url + '">' + sub_row.label + '</a>\n'
					html_row += '<li role="menuitem">\n' + sub_html_row + '</li>\n'
				}
				html_row += '</ul>\n'
				
				html_left_menus += '<li>\n' + html_row + '</li>\n'
			}
			else
			{
				const url = runtime.context.get_url_with_credentials(state.app_url + row.url, this.request)
				const html_row = '<a href="/' + url + '">' + row.label + '</a>\n'
				html_left_menus += '<li>\n' + html_row + '</li>\n'
			}
		}
		
		
		// BUILD HTML TABLE
		let html = ''
		html += '<div class="" id="' + this.get_dom_id() + '" style="display:none;">'
		html += '<nav class="top-bar">\n'
		
		html += '	<div class="top-bar-title">\n'
		html += '		<ul class="dropdown menu">'
		html += '			<li role="menuitem">\n'
		html += '				<strong>' + this.state.label + ' HELLO !!</strong>\n'
		html += 			'</li>\n'
		html += 		'</ul>\n'
		html += '	</div>\n'
		
		html += 	'<div class="top-bar-left">\n'
		html += 		'<ul class="dropdown menu" data-dropdown-menu>\n'
		html += 			html_left_menus
		html += 		'</ul>\n'
		html += 	'</div>\n'
		html += '</div>\n'
		html += '</nav>\n'
		
		return html
	}
}
