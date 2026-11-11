import React,{useState} from 'react';
import { ArrowRight, Bot, Check, Loader2, Sparkles, X } from 'lucide-react';
import { api } from '../lib/api';
export default function AssistantPanel({ onClose }) {
  const [question,setQuestion]=useState(''); const [answer,setAnswer]=useState('');
  const [error,setError]=useState('');const [loading,setLoading]=useState(false);
  async function ask(e) {
    e?.preventDefault(); if(question.trim().length<3)return;
    setLoading(true);setError('');setAnswer('');
    try {const data=await api('/api/ia/preguntar',{method:'POST',body:{pregunta:question.trim()}});setAnswer(data.respuesta)}
    catch(ex){setError(ex.message)}finally{setLoading(false)}
  }
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="side-drawer assistant-drawer" role="dialog" aria-modal="true" aria-label="Asesor GrowLab">
      <div className="drawer-top"><span className="drawer-badge"><Sparkles size={16}/> GROWLAB AI</span><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X/></button></div>
      <div className="assistant-intro"><span className="assistant-icon"><Bot size={28}/></span><h2>¿Qué necesitas para tu espacio verde?</h2><p>Tu asesor de equipamiento botánico. Las respuestas se generan con Claude desde nuestra API.</p></div>
      <div className="suggestions"><span className="eyebrow">Puedes preguntar</span>
        {['¿Cómo elijo una luz LED para plantas de interior?','¿Qué diferencia hay entre una maceta textil y una tradicional?','¿Qué debo medir en un jardín de interior?'].map(q=><button key={q} onClick={()=>setQuestion(q)}><Check size={14}/>{q}</button>)}
      </div>
      {answer && <div className="assistant-answer"><span className="eyebrow">RESPUESTA DEL ASISTENTE</span><p>{answer}</p></div>}
      {error && <p role="alert" className="form-error">{error}</p>}
      <form className="assistant-form" onSubmit={ask}>
        <label htmlFor="ai-question">Tu consulta</label><textarea id="ai-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={2000} minLength={3} placeholder="Escribe tu pregunta..." rows="3" required />
        <button className="primary-button" disabled={loading || question.trim().length<3}>{loading?<Loader2 className="spin" size={18}/>:<ArrowRight size={18}/>} {loading?'Consultando Claude...':'Preguntar'}</button>
        <small>La IA requiere ANTHROPIC_API_KEY configurada en el servidor. No sustituye asesoría técnica o legal.</small>
      </form>
    </section>
  </div>;
}
