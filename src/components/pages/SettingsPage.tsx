'use client';

import { useState } from 'react';
import { User, Key, Bell, Shield, Palette, Database, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = ['Profile', 'API Keys', 'Notifications', 'Appearance', 'Security', 'Data'];

export function SettingsPage() {
  const [section, setSection] = useState('Profile');

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-black text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Configure your dashboard preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 shrink-0">
          <div className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  section === s
                    ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                )}
              >
                {s === 'Profile' && <User className="w-4 h-4" />}
                {s === 'API Keys' && <Key className="w-4 h-4" />}
                {s === 'Notifications' && <Bell className="w-4 h-4" />}
                {s === 'Appearance' && <Palette className="w-4 h-4" />}
                {s === 'Security' && <Shield className="w-4 h-4" />}
                {s === 'Data' && <Database className="w-4 h-4" />}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {section === 'Profile' && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Profile Settings</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent)] flex items-center justify-center font-black text-2xl text-white">
                    F
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">Fata Akromulm</div>
                    <div className="text-xs text-[var(--text-muted)]">fata@example.com</div>
                    <button className="text-[10px] text-[var(--accent)] font-bold mt-1 hover:underline">Change avatar</button>
                  </div>
                </div>
                {[
                  { label: 'Display Name', value: 'Fata Akromulm', type: 'text' },
                  { label: 'Email', value: 'fata@example.com', type: 'email' },
                  { label: 'Timezone', value: 'Asia/Jakarta (GMT+7)', type: 'text' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)]"
                    />
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-[var(--bg-void)] font-bold text-sm hover:brightness-110 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {section === 'API Keys' && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">API Keys</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { exchange: 'Kraken Pro', name: 'Main Trading Key', permissions: 'Read, Trade, Withdraw', status: 'active', last: '2h ago' },
                  { exchange: 'Jupiter', name: 'Jupiter API Key', permissions: 'Read, Swap', status: 'active', last: '1d ago' },
                ].map((key, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">{key.exchange}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{key.name} · {key.permissions}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-1">Last used: {key.last}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--positive)]/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--positive)]" />
                        <span className="text-[10px] font-bold text-[var(--positive)]">{key.status}</span>
                      </div>
                      <button className="text-[var(--text-muted)] hover:text-[var(--negative)] transition-colors">
                        <Key className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border)] text-[var(--text-secondary)] font-bold text-sm hover:border-[var(--border-active)] hover:text-[var(--accent)] transition-all">
                  + Add API Key
                </button>
              </div>
            </div>
          )}

          {section === 'Notifications' && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Notification Preferences</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { label: 'Trade executions', desc: 'Get notified when a trade is placed or closed', enabled: true },
                  { label: 'Signal alerts', desc: 'AI signal triggers and probability changes', enabled: true },
                  { label: 'P&L alerts', desc: 'Significant gains or losses on positions', enabled: false },
                  { label: 'Agent status', desc: 'When agents are paused, resumed, or encounter errors', enabled: true },
                  { label: 'Daily summary', desc: 'End-of-day performance report', enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">{notif.label}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{notif.desc}</div>
                    </div>
                    <button className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      notif.enabled ? 'bg-[var(--accent)]' : 'bg-[var(--bg-base)]'
                    )}>
                      <div className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                        notif.enabled ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'Appearance' && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Appearance</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Dark', 'Light', 'System'].map((theme) => (
                      <button
                        key={theme}
                        className={cn(
                          'py-2.5 rounded-xl text-xs font-bold border transition-all',
                          theme === 'Dark'
                            ? 'bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--border-active)]'
                            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-active)]'
                        )}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Accent Color</label>
                  <div className="flex gap-2">
                    {['#00F0FF', '#A855F7', '#39FF14', '#FF6B35', '#F59E0B'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-xl border-2 transition-all"
                        style={{ background: color, borderColor: color === '#00F0FF' ? 'white' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'Security' && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Security</h3>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-active)] transition-all">
                  <div className="text-sm font-medium text-[var(--text-primary)]">Change Password</div>
                  <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-active)] transition-all">
                  <div className="text-sm font-medium text-[var(--text-primary)]">Two-Factor Authentication</div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--positive)]/10">
                    <Check className="w-3 h-3 text-[var(--positive)]" />
                    <span className="text-[10px] font-bold text-[var(--positive)]">Enabled</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--negative)]/30 transition-all">
                  <div className="text-sm font-medium text-[var(--negative)]">Log out all devices</div>
                  <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>
          )}

          {section === 'Data' && (
            <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Data Management</h3>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-active)] transition-all">
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">Export Trade History</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Download as CSV</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-active)] transition-all">
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">Sync with Kraken</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Last synced: 2h ago</div>
                  </div>
                  <div className="text-xs font-bold text-[var(--accent)]">Sync Now</div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--negative)]/30 hover:bg-[var(--negative)]/5 transition-all">
                  <div className="text-sm font-medium text-[var(--negative)]">Clear Local Cache</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Frees ~12MB</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
