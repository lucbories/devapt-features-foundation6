
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
		
		
		arg_settings.scripts.push(`
			$('a.menu_onclick').click(
				function(ev)
				{
					var menu = $(ev.currentTarget);
					var router = window.devapt().runtime().router()
					var view_name = menu.data('view')
					var menubar_name = menu.data('menubar')
					var url = menu.data('url')
					
					if (view_name)
					{
						router.display_content(view_name, menubar_name)
						return
					}

					if (url)
					{
						router.parse(url)
					}
				}
			)
		`)
		
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
					// const url = runtime.context.get_url_with_credentials(state.app_url + sub_row.url, this.request)
					// const sub_html_row =  '<a href="/' + url + '">' + sub_row.label + '</a>\n'
					const sub_html_row = this._render_menu_anchor(sub_row)
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
		html += '				<strong>' + this.state.label + '</strong>\n'
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

	_render_menu_anchor(arg_menu_item)
	{
		const state = this.get_state()
		const app_url = state.app_url

		// MENU ITEM IS A COMMAND NAME ?
		if ( T.isString(arg_menu_item) )
		{
			if (this.renderer.application)
			{
				const cmd = this.renderer.application.find_resource(arg_menu_item, 'commands')
				if ( T.isObject(cmd) )
				{
					arg_menu_item = {
						url: cmd.command_url,
						view: cmd.command_view,
						menubar: cmd.command_menubar,
						label: cmd.command_label
					}
				} else {
					console.error('command not found for ' + arg_menu_item)
				}
			} else {
				console.error('no application for menubar renderer')
			}
		}

		if ( T.isObject(arg_menu_item) && T.isString(arg_menu_item.label) )
		{
			const anchor_attributes = 'class="menu_onclick" data-view="' + arg_menu_item.view + '" data-menubar="' + arg_menu_item.menubar + '" data-url="' + arg_menu_item.url + '" data-app_url="' + app_url + '"'
			if ( T.isString(arg_menu_item.url) )
			{
				const blank = T.isBoolean(arg_menu_item.has_blank) && arg_menu_item.has_blank ? 'target="_blank"' : ''
				const url = runtime.context.get_url_with_credentials(app_url + arg_menu_item.url, this.renderer.request)
				// const anchor = '<a href="#' + url + '"' + blank + '>' + arg_menu_item.label + '</a>\n'
				// const anchor = '<a href="#"' + blank + ' onclick="document.devapt().runtime().router().router_engine.parse(\'' + arg_menu_item.url + '\'")">' + arg_menu_item.label + '</a>\n'
				const anchor = '<a href="#"' + blank + ' ' + anchor_attributes + '>' + arg_menu_item.label + '</a>\n'
				return anchor
			}

			if ( T.isString(arg_menu_item.view) )
			{
				const anchor = '<a href="#" ' + anchor_attributes + '>' + arg_menu_item.label + '</a>\n'
				return anchor
			}
		}

		console.error(context + ':bad menu item', arg_menu_item)
		return ''
	}
}
