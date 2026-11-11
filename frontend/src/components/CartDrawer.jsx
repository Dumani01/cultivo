import React,{useRef,useState} from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X, ShieldCheck } from 'lucide-react';
import {api,colones} from '../lib/api';
export default function CartDrawer({ items,onChange,onClose,onClear }) {
  const [checkout,setCheckout]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [order,setOrder]=useState(null);
  const idempotency=useRef(null);
  const [form,setForm]=useState({nombre:'',email:'',telefono:'',provincia:'',direccion:'',observaciones:''});
  const total=items.reduce((s,i)=>s+i.product.precio*i.quantity,0);
  const handleSubmit=async e=>{
    e.preventDefault();setBusy(true);setError('');
    try {
      if(!idempotency.current)idempotency.current=crypto.randomUUID();
      const result=await api('/api/pedidos',{method:'POST',headers:{'Idempotency-Key':idempotency.current},body:{...form,items:items.map(i=>({productoId:i.product.id,cantidad:i.quantity}))}});
      setOrder(result);onClear();
    }catch(ex){setError(ex.message)}finally{setBusy(false)}
  };
  const field=(key,label,placeholder,extra={})=><label className="field" key={key}>{label}<input value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder} required {...extra}/></label>;
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <aside className="side-drawer cart-drawer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="drawer-top"><h2>{order?'Pedido registrado':checkout?'Finalizar pedido':'Tu carrito'} <span>{items.reduce((s,i)=>s+i.quantity,0)}</span></h2><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X/></button></div>
      {order?<div className="cart-success"><CheckCircle2 size={52}/><h2>¡Pedido recibido!</h2><p>Hemos registrado los artículos seleccionados. Consulta el estado de tu pedido con el siguiente código.</p><div className="order-code"><small>CÓDIGO PARA SEGUIMIENTO</small><strong>{order.codigo}</strong></div><p>Conserva este código y tu correo electrónico para consultar su estado.</p><button className="primary-button" onClick={onClose}>Volver a la tienda <ArrowRight size={18}/></button></div>
      :checkout?<form className="checkout-form" onSubmit={handleSubmit}>
        <button className="back-link" type="button" onClick={()=>setCheckout(false)}><ArrowLeft size={16}/> Volver al carrito</button>
        <div className="checkout-notice"><ShieldCheck size={22}/><div><b>Detalles de tu pedido</b><span>Revisa la información antes de enviar tu solicitud.</span></div></div>
        <h3>Datos de contacto</h3>
        {field('nombre','Nombre completo','Tu nombre',{minLength:2,maxLength:90})}
        {field('email','Correo electrónico','nombre@correo.com',{type:'email'})}
        {field('telefono','Teléfono','8888-8888',{minLength:7,maxLength:25})}
        <h3>Detalles de entrega</h3>
        <label className="field">Provincia<select value={form.provincia} onChange={e=>setForm(f=>({...f,provincia:e.target.value}))} required><option value="">Seleccionar provincia</option>{['San José','Alajuela','Cartago','Heredia','Guanacaste','Puntarenas','Limón'].map(v=><option key={v}>{v}</option>)}</select></label>
        {field('direccion','Dirección de entrega','Cantón, distrito y señas',{minLength:8,maxLength:250})}
        <label className="field">Observaciones (opcional)<textarea maxLength={500} value={form.observaciones} onChange={e=>setForm(f=>({...f,observaciones:e.target.value}))} rows={2} placeholder="Indicaciones especiales"/></label>
        <div className="checkout-total"><span>Total de productos</span><strong>{colones(total)}</strong></div>
        {error&&<p role="alert" className="form-error">{error}</p>}
        <button className="primary-button" disabled={busy}>{busy?'Guardando pedido...':'Confirmar pedido'} <ArrowRight size={18}/></button>
        <small className="form-footnote">Al confirmar recibirás un código para consultar el estado del pedido.</small>
      </form>:<>
        {items.length===0?<div className="empty-cart"><ShoppingBag size={46}/><h3>Tu carrito está esperando.</h3><p>Encuentra todo lo necesario para tu próximo proyecto botánico.</p><button className="primary-button" onClick={onClose}>Explorar productos <ArrowRight size={18}/></button></div>
        :<><div className="cart-lines">{items.map(i=><div className="cart-line" key={i.product.id}>
          <img src={`/art/${i.product.imagen}.svg`} alt=""/><div><b>{i.product.nombre}</b><strong>{colones(i.product.precio*i.quantity)}</strong><div className="qty-row"><button onClick={()=>onChange(i.product,-1)} aria-label="Restar una unidad"><Minus size={14}/></button><span>{i.quantity}</span><button onClick={()=>onChange(i.product,1)} disabled={i.quantity>=i.product.stock} aria-label="Sumar una unidad"><Plus size={14}/></button><button className="remove-item" onClick={()=>onChange(i.product,-i.quantity)} aria-label="Eliminar artículo"><Trash2 size={15}/></button></div></div>
        </div>)}</div><div className="cart-footer"><div className="subtotal"><span>Subtotal</span><strong>{colones(total)}</strong></div><small>Gastos de envío sujetos a confirmación.</small><button className="primary-button" onClick={()=>{setCheckout(true);setError('')}}>Continuar al pedido <ArrowRight size={18}/></button></div></>}
      </>}
    </aside>
  </div>;
}
