class comp_field{
	constructor(){
		this.create_table();
		this.value='comp';
		game_field.appendChild(this.interface);
	}
	make_cells_no_reactable(){
		this.cells_matrix.forEach((element)=>{
			element.forEach((element)=>{
				element.interface.onclick=null;
			})
		})
	}
	show_sea(){
		this.cells_matrix.forEach((element)=>{
			element.forEach((element)=>{
				if(element.value===0)
					element.interface.style.background = 'blue';
			})
		})
	}
	create_table()
	{
		this.interface=document.createElement('table');
		this.cells_matrix=create_matrix(10,10);
		for(var i=0;i<10;i++)
		{
			var tr=document.createElement('tr');
			this.interface.appendChild(tr);
			for(var j=0;j<10;j++)
			{
				var new_comp_cell=new cell(j,i);
				new_comp_cell.parent=this;
				tr.appendChild(new_comp_cell.interface);
				this.cells_matrix[j][i]=new_comp_cell;
			}
		}
	}
	create_ships(){
		this.find_place_and_create_ship(4);
		for(var i=0;i<2;i++)
			this.find_place_and_create_ship(3);
		for(var i=0;i<3;i++)
			this.find_place_and_create_ship(2);
		for(var i=0;i<4;i++)
			this.find_place_and_create_ship(1);
	}
	find_place_and_create_ship(ship_len)
	{
		var x=Math.floor(Math.random()*10);
		var y=Math.floor(Math.random()*10);
		var random_cell=this.cells_matrix[x][y];
		while(random_cell.ship_directions_and_start_cell(ship_len)===false)
		{
			x=Math.floor(Math.random()*10);
			y=Math.floor(Math.random()*10);
			random_cell=this.cells_matrix[x][y];
		}
		var arr=rand_in_arr(random_cell.ship_directions_and_start_cell(ship_len));
		var direction=arr[0];
		var start_cell=arr[1];
		this.create_ship(start_cell,ship_len,direction);
	}
	create_ship(start_cell,len,direction){
		var ship_obj=new comp_ship(this);
		for(var i=0;i<len;i++)
		{
			if(direction==='horizontal')
				ship_obj.cells.push(this.cells_matrix[start_cell.x+i][start_cell.y]);
			else if(direction==='vertical')
				ship_obj.cells.push(this.cells_matrix[start_cell.x][start_cell.y+i]);
		}
		ship_obj.cells.forEach((element)=>{
			element.value=len;
		})
		ship_obj.cells.forEach((element)=>{
			element.get_neighbours().forEach((element)=>{
				if(element.value!==len)
					element.value=-1;
			})
		})
		ship_obj.cells.forEach((element)=>{
			element.ship=ship_obj;
			element.interface.style.background = 'red';
		})
	}
}
class cell{
	constructor(x,y){
		this.parent=null;
		this.ship=null;
		this.value=0;
		this.x=x;
		this.y=y;
		this.interface=document.createElement('td');
		this.interface.onclick=()=>{play_game.call(this)}
		
	}
	get_neighbours(){
		var arr=[];
		if(this.x>0)
			arr.push(this.parent.cells_matrix[this.x-1][this.y]);
		if(this.x<9)
			arr.push(this.parent.cells_matrix[this.x+1][this.y]);
		if(this.y>0)
			arr.push(this.parent.cells_matrix[this.x][this.y-1]);
		if(this.y<9)
			arr.push(this.parent.cells_matrix[this.x][this.y+1]);
		if(this.x>0&&this.y>0)
			arr.push(this.parent.cells_matrix[this.x-1][this.y-1]);
		if(this.x>0&&this.y<9)
			arr.push(this.parent.cells_matrix[this.x-1][this.y+1]);
		if(this.x<9&&this.y>0)
			arr.push(this.parent.cells_matrix[this.x+1][this.y-1]);
		if(this.x<9&&this.y<9)
			arr.push(this.parent.cells_matrix[this.x+1][this.y+1]);
		return arr;
	}
	max_left_len(){
		var count=0;
		var x=this.x;
		while(x>0&&this.parent.cells_matrix[x-1][this.y].value===0)
		{
			count++;
			x--;
		}
		return count;
	}
	max_right_len(){
		var count=0;
		var x=this.x;
		while(x<9&&this.parent.cells_matrix[x+1][this.y].value===0)
		{
			count++;
			x++;
		}
		return count;
	}
	max_horiz_len(){
		if(this.value!==0)
			return 0;
		return this.max_left_len()+this.max_right_len()+1;
	}
	max_top_len()
	{
		var count=0;
		var y=this.y;
		while(y>0&&this.parent.cells_matrix[this.x][y-1].value===0)
		{
			count++;
			y--;
		}
		return count;
	}
	max_bottom_len()
	{
		var count=0;
		var y=this.y;
		while(y<9&&this.parent.cells_matrix[this.x][y+1].value===0)
		{
			count++;
			y++;
		}
		return count;
	}
	max_vert_len(){
		if(this.value!==0)
			return 0;
		return this.max_top_len()+this.max_bottom_len()+1;
	}
	max_ship_len(){
		return Math.max(this.max_vert_len(),this.max_horiz_len());
	}
	ship_directions_and_start_cell(ship_len){
		if(this.max_ship_len()<ship_len)
			return false;
		if(this.max_horiz_len()>=ship_len&&this.max_vert_len()>=ship_len)
			return [['horizontal',this.parent.
		cells_matrix[this.x-this.max_left_len()][this.y]]
		,['vertical',this.parent.
		cells_matrix[this.x][this.y-this.max_top_len()]]];
		if(this.max_horiz_len()>=ship_len)
			return [['horizontal',this.parent.
		cells_matrix[this.x-this.max_left_len()][this.y]]];
		if(this.max_vert_len()>=ship_len)
			return [['vertical',this.parent.
		cells_matrix[this.x][this.y-this.max_top_len()]]];
	}
}
class player_field extends comp_field {
	constructor(){
		super();
		this.ships=[];
		this.value='player';
	}
	remove_ship(ship){
		this.ships.splice(this.ships.indexOf(ship),1);
	}
	hide_ships(){
		this.ships.forEach((element)=>{
			var ship=element;
			element.interface.style.display='none';
			element.cells.map((element)=>{
				element.interface.style.background = 'red';
				element.ship=ship;
			})
		})
	}
	update_cells_status(){
		this.ships.forEach((element)=>{
			element.fill_ship_space();
		})
	}
	place_ship(ship){
		var x=get_coords(ship.interface).left-
		get_coords(this.interface).left;
		var y=get_coords(ship.interface).top-
		get_coords(this.interface).top;
		var i=Math.min(Math.ceil((x-24)/24),9);
		var j=Math.min(Math.ceil((y-24)/24),9);
		var start_cell=this.cells_matrix[i][j];
		if(start_cell.value!==0)
			return;
		if(ship.width>1&&start_cell.max_right_len()>=ship.width-1)
		{
			for(var k=0;k<ship.width;k++)
				ship.cells.push(this.cells_matrix[i+k][j]);
			this.ships.push(ship);
			ship.parent=this;
		}
		else if(ship.height>1&&start_cell.max_bottom_len()>=ship.height-1)
		{
			for(var k=0;k<ship.height;k++)
				ship.cells.push(this.cells_matrix[i][j+k]);
			this.ships.push(ship);
			ship.parent=this;
		}
		else if(ship.width===1&&ship.height===1)
		{
			ship.cells.push(start_cell);
			this.ships.push(ship);
			ship.parent=this;
		}
		this.update_cells_status();
		ship.interface.style.top=this.y+3+j*25.5+'px';
		ship.interface.style.left=this.x+3+i*25+'px';
		
		
	}
	catch_ship(event,ship,shift_x,shift_y){
		this.x=get_coords(this.interface).left-
		get_coords(game_field).left;
		this.y=get_coords(this.interface).top-
		get_coords(game_field).top;
		var x=event.pageX-
		get_coords(game_field).left-this.x;
		var y=event.pageY-
		get_coords(game_field).top-this.y;
		var width=this.interface.offsetWidth;
		var height=this.interface.offsetHeight;
		if(x>=shift_x&&x<(width+shift_x-ship.interface.offsetWidth)&&
			y>shift_y&&y<(height+shift_y-ship.interface.offsetHeight))
		{    
			this.place_ship(ship);
			if(ship.cells.length===0)
			{
				ship.move_to(ship.start_x,ship.start_y);
				player_ships_box_obj.ships.push(ship);
				ship.parent=player_ships_box_obj;
			}
		}
		else
		{
			ship.move_to(ship.start_x,ship.start_y);
			player_ships_box_obj.ships.push(ship);
			ship.parent=player_ships_box_obj;
		}
		
	}
}
class player_ships_box
{
	constructor(){
		var div=document.createElement('div');
		game_field.appendChild(div);
		this.interface=div;
		this.ships=[];
		this.create_ships();
		this.show_ships();
		this.make_ships_draggable();
	}
	remove_ship(ship){
		this.ships.splice(this.ships.indexOf(ship),1);
	}
	create_ships(){
		var player_ship_obj=new player_ship(this,4,1);
		this.ships.push(player_ship_obj);
		for(var i=0;i<2;i++)
		{
			var player_ship_obj=new player_ship(this,3,1);
			this.ships.push(player_ship_obj);
		}
		for(var i=0;i<3;i++)
		{
			var player_ship_obj=new player_ship(this,2,1);
			this.ships.push(player_ship_obj);
		}
		for(var i=0;i<4;i++)
		{
			var player_ship_obj=new player_ship(this,1,1);
			this.ships.push(player_ship_obj);
		}
	}
	show_ships(){
		this.ships.forEach((element,index)=>{
			this.interface.appendChild(element.interface);
			element.start_x=get_coords(this.interface).left-
			get_coords(game_field).left+20-250;
			element.start_y=get_coords(this.interface).top-
			get_coords(game_field).top+50*index+20;
			element.move_to(element.start_x,element.start_y);
		})
	}
	make_ships_draggable(){
		this.ships.forEach((element)=>{
			element.make_draggable();
		})
	}
}
class comp_ship{
	constructor(parent)
	{
		this.parent=parent;
		this.cells=[];
	}
	check_is_alive(){
		if(this.cells.every((element)=>{
			return element.value===null}))
		{
			
			this.cells.forEach((element)=>{
				element.get_neighbours().map((element)=>{
					if(element.value===-1)
					{
						element.value=null;
						element.interface.style.background = 'blue';
					}
				})
			})
		}
	}
	color_cells(){
		this.cells.forEach((element)=>{
			element.elem.style.background = 'red';
		})
	}
}
class player_ship{
	constructor(parent,width,height)
	{
		this.parent=parent;
		this.interface=create_table(width,height);
		this.interface.style.position='absolute';
		this.width=width;
		this.height=height;
		this.start_x=null;
		this.start_y=null;
		this.cells=[];
		this.interface.ondblclick=()=>{
			if(this.cells.length>0)
				return;
			var temp=this.width;
			this.width=this.height;
			this.height=temp;
			this.interface.innerHTML=create_table(this.width,this.height).innerHTML;
		}
	}
	check_is_alive(){
		if(this.cells.every((element)=>{
			return element.value===null}))
		{
			
			this.cells.forEach((element)=>{
				element.get_neighbours().map((element)=>{
					if(element.value===-1)
					{
						element.value=null;
						element.interface.style.background = 'blue';
					}
				})
			})
		}
	}
	move_to(x,y)
	{
		this.interface.style.left=x+'px';
		this.interface.style.top=y+'px';
	}
	fill_ship_space(){
		this.cells.forEach((element)=>{
			element.value=Math.max(this.width,this.height);
			element.get_neighbours().forEach((element)=>{
				if(element.value===0)
					element.value=-1;
			})
		})
	}
	clear_space(){
		this.cells.forEach((element)=>{
			element.value=0;
			element.get_neighbours().forEach((element)=>{
				element.value=0;
			})
		})
		this.cells=[];
	}
	make_draggable(){
		var ship=this;
		var elem=this.interface;
		elem.onmousedown=function(event){
			ship.clear_space();
			player_field_obj.update_cells_status();
			ship.parent.remove_ship(ship);
			ship.parent=null;
			var shift_x=event.pageX-get_coords(elem).left;
			var shift_y=event.pageY-get_coords(elem).top;
			elem.ondragstart=function(){return false};
			move(event);
			game_field.addEventListener('mousemove',move);
			function move(event){
				elem.style.left=
				Math.max(0,Math.min(event.pageX-get_coords(game_field).left-shift_x,
					game_field.offsetWidth-elem.offsetWidth))+'px';
				elem.style.top=
				Math.max(0,Math.min(event.pageY-get_coords(game_field).top-shift_y,
					game_field.offsetHeight-elem.offsetHeight))+'px';
			}
			document.onmouseup=function(event){
				player_field_obj.catch_ship(event,ship,shift_x,shift_y);
				game_field.removeEventListener('mousemove',move);
				document.onmouseup=null;
			};
		};
	}
}

function create_matrix(m,n)
{
	var arr=[];
	for(var i=0;i<m;i++)
	{
		arr[i]=[];
	}
	return arr;
}
function create_table(m,n)
{
	var table=document.createElement('table');
	for(var i=0;i<n;i++)
	{
		var row=document.createElement('tr');
		table.appendChild(row);
		for(var j=0;j<m;j++)
		{
			var cell=document.createElement('td');
			row.appendChild(cell);
			cell.style.background = 'red';
		}
	}
	return table;
}
function rand_in_arr(arr)
{
	var len=arr.length;
	var rand_ind=Math.floor(Math.random()*len);
	return arr[rand_ind];
}
function get_coords(elem){
	var box=elem.getBoundingClientRect();
	return {
		left:box.left+pageYOffset,
		top:box.top+pageXOffset
	}
}
function func(){
	player_field_obj.cells_matrix.forEach((arr)=>{
		arr.forEach((elem)=>{
			elem.interface.innerHTML=elem.value;
		})
	})
}
function play_game(){
	if(this.value!==null&&global_count!==null&&global_count%2===1&&this.parent.value==='comp')
	{
		
		if(this.value>0)
		{
			this.value=null;
			this.ship.check_is_alive();
			global_player++;
			this.interface.style.background = 'black';
			if(global_player===20)
			{
				comp_field_obj.make_cells_no_reactable();
				game_info.innerHTML='Игрок победил';
				comp_field_obj.show_sea();
				return;
			}
		}
		else
		{
			this.interface.style.background = 'blue';
			this.value=null;
		}
		global_count++;
		game_info.innerHTML='Ходит Компьютер';
		console.log('player='+global_player);
		setTimeout(()=>{
			var x=Math.floor(Math.random()*10);
			var y=Math.floor(Math.random()*10);
			var cell=player_field_obj.cells_matrix[x][y];
			while(cell.value===null)
			{
				x=Math.floor(Math.random()*10);
				y=Math.floor(Math.random()*10);
				cell=player_field_obj.cells_matrix[x][y];
			}
			if(cell.value>0)
			{
				cell.value=null;
				cell.ship.check_is_alive();
				global_comp++;
				cell.interface.style.background = 'black';
				if(global_comp===20)
				{
					comp_field_obj.make_cells_no_reactable();
					game_info.innerHTML='Компьютер победил';
					return;
				}
			}
			else
			{
				cell.interface.style.background = 'blue';
				cell.value=null;
			}
			
			global_count++;
			game_info.innerHTML='Ходит Игрок';
			console.log('comp='+global_comp);
		},1500);
		
	}
	
}
function start_again(){
	game_field.removeChild(player_ships_box_obj.interface);
	game_field.removeChild(player_field_obj.interface);
	game_field.removeChild(comp_field_obj.interface);
	player_ships_box_obj=new player_ships_box();
	player_field_obj=new player_field();
	comp_field_obj=new comp_field();
	comp_field_obj.create_ships();
	play.onclick=()=>{
		if(player_field_obj.ships.length===10)
		{
			global_player=0;
			global_comp=0;
			global_count=null;
			player_field_obj.hide_ships();
			global_count=1;
			if(global_count%2===0)
				game_info.innerHTML='Ходит Компьютер';
			else
				game_info.innerHTML='Ходит Игрок';
			play.onclick=null;
		}
	}
}

var play=document.getElementById('play');
var start_button=document.getElementById('start');
var game_field=document.getElementById('game_field');
var game_info=document.getElementById('game_info');
var player_ships_box_obj=new player_ships_box();
var player_field_obj=new player_field();
var comp_field_obj=new comp_field();
comp_field_obj.create_ships();
play.onclick=()=>{
	if(player_field_obj.ships.length===10)
	{
		global_player=0;
		global_comp=0;
		player_field_obj.hide_ships();
		global_count=1;
		if(global_count%2===0)
			game_info.innerHTML='Ходит Компьютер';
		else
			game_info.innerHTML='Ходит Игрок';
		play.onclick=null;
	}
}
start_button.onclick=()=>{
	start_again();
}
