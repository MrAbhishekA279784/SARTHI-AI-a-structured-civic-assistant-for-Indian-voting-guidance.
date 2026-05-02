'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Bell, Calendar, Plus, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

export default function RemindersPage() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useAppStore();
  const { addToast } = useToastStore();
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) {
      addToast('Please provide both title and date', 'error');
      return;
    }

    addReminder({
      title: newTitle,
      date: newDate,
      time: '10:00',
      completed: false,
      type: 'custom'
    });

    setNewTitle('');
    setNewDate('');
    addToast('Reminder added successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900">Election Reminders</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          Never miss an important date. Set reminders for registration deadlines, polling dates, and community events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm sticky top-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add Reminder
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5 ml-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Check Voter ID Status"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5 ml-1">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-200"
              >
                Set Reminder
              </button>
            </form>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Reminders are saved locally and synced across your devices. Push notifications are available in the mobile app.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Your Schedule</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {reminders.filter(r => !r.completed).length} Upcoming
              </span>
            </div>

            <div className="divide-y divide-zinc-100">
              {reminders.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                    <Bell className="w-8 h-8 text-zinc-300" />
                  </div>
                  <p className="text-zinc-500">No reminders set yet. Start by adding one!</p>
                </div>
              ) : (
                reminders.map((reminder) => (
                  <div 
                    key={reminder.id}
                    className={`p-6 flex items-center justify-between transition-all ${reminder.completed ? 'bg-zinc-50/50' : 'bg-white hover:bg-zinc-50/30'}`}
                  >
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={() => toggleReminder(reminder.id)}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          reminder.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-zinc-200 bg-white hover:border-blue-400'
                        }`}
                      >
                        {reminder.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <p className={`font-bold transition-all ${reminder.completed ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                          {reminder.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            {reminder.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg active:scale-95 transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}