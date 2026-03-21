import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Landmark, CreditCard, BarChart3, Lock, Heart, TrendingUp, Users, Shield, Zap, Trophy, Star, Sparkles, Eye, EyeOff, Settings, Bell, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import ParticleBackground from "@/components/ParticleBackground";

const chartData = [
  { month: "Jan", savings: 4000, members: 240 },
  { month: "Feb", savings: 5200, members: 320 },
  { month: "Mar", savings: 6100, members: 410 },
  { month: "Apr", savings: 7200, members: 540 },
  { month: "May", savings: 8900, members: 720 },
  { month: "Jun", savings: 10200, members: 1050 },
];

export default function Showcase() {
  return (
    <div className="relative min-h-screen pb-24">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(234,179,8,0.08)_0%,transparent_70%)] pointer-events-none rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/5 px-4 py-2 rounded-full mb-6 border border-gold/10">
              <Sparkles size={16} className="text-gold" />
              <span className="text-gold text-xs font-semibold tracking-widest uppercase">Premium Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-cinzel font-black mb-4 text-balance">
              <span className="gold-gradient-text">Rejoice Ajo</span> Platform Tour
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore the comprehensive suite of features that make Rejoice Ajo the most trusted rotating savings platform in Nigeria.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-gold px-8 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center">
                Start Today <ArrowRight size={18} />
              </Link>
              <button className="btn-glass px-8 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center">
                Learn More <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
            {[
              { icon: Landmark, value: "₦2.4B+", label: "Total Saved", trend: "+24%" },
              { icon: Users, value: "1,200+", label: "Active Members", trend: "+45%" },
              { icon: Trophy, value: "98%", label: "Payout Success", trend: "+8%" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl text-center group hover:border-gold/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={20} className="text-gold" />
                </div>
                <p className="text-2xl font-cinzel font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                <p className="text-emerald-400 text-xs mt-2 font-semibold">{stat.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gold/10" />

      {/* Core Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/20 hover:bg-gold/20">Core Features</Badge>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 gold-gradient-text">What Makes Us Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Industry-leading security, transparency, and community-driven financial empowerment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Lock, title: "Bank-Grade Security", desc: "All transactions verified by admin with full audit trail. Your funds are protected 24/7." },
              { icon: Shield, title: "Verified Members", desc: "Every member undergoes KYC verification. Trusted network ensures peace of mind." },
              { icon: TrendingUp, title: "Structured Payouts", desc: "Transparent slot system. Know exactly when you'll receive your full rotation payout." },
              { icon: Bell, title: "Real-time Notifications", desc: "Instant alerts on contributions, payouts, and group activities. Stay informed always." },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Detailed insights into your savings journey, group performance, and financial trends." },
              { icon: Heart, title: "Community Focused", desc: "More than savings. Build relationships, share financial goals, grow together." },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl group hover:border-gold/40 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-all">
                  <feature.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gold/10" />

      {/* How It Works - Tabs */}
      <section className="py-20 px-4 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.02)_0%,transparent_70%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/20 hover:bg-gold/20">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 gold-gradient-text">Four Steps to Wealth</h2>
            <p className="text-muted-foreground">Join thousands building financial discipline through community savings.</p>
          </div>

          <Tabs defaultValue="step1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-gold/10 p-1 h-auto rounded-2xl">
              {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, i) => (
                <TabsTrigger key={i} value={`step${i + 1}`} className="rounded-xl">
                  <span className="hidden sm:inline">{step}</span>
                  <span className="sm:hidden text-xs">{i + 1}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="step1" className="mt-8">
              <Card className="bg-background/50 border-gold/10">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl font-cinzel font-bold mb-4 gold-gradient-text">Create Your Account</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Register with your details and complete KYC verification. Our secure process ensures your identity is protected while building trust with the community.
                      </p>
                      <ul className="space-y-3">
                        {["Personal information", "Identity verification", "Bank details", "Emergency contact"].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-gold shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card p-8 rounded-2xl">
                      <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto">
                        <span className="text-3xl font-cinzel font-black text-gold">01</span>
                      </div>
                      <p className="text-center text-muted-foreground mt-4 text-sm">Takes approximately 5 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step2" className="mt-8">
              <Card className="bg-background/50 border-gold/10">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl font-cinzel font-bold mb-4 gold-gradient-text">Choose Your Group</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Browse active savings circles designed for different contribution amounts and financial goals. Find the perfect group that aligns with your savings plan.
                      </p>
                      <ul className="space-y-3">
                        {["Filter by contribution level", "View group details", "Check member reviews", "See payout schedule"].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-gold shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card p-8 rounded-2xl space-y-4">
                      {[
                        { name: "Emerald Circle", contrib: "₦50,000", members: "12/15", rate: "98%" },
                        { name: "Gold Collective", contrib: "₦100,000", members: "8/10", rate: "100%" },
                        { name: "Elite Ring", contrib: "₦250,000", members: "5/6", rate: "99%" },
                      ].map((group, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5 border border-gold/10 hover:border-gold/30 transition-all">
                          <p className="font-semibold text-sm text-foreground">{group.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{group.contrib} • {group.members} members</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step3" className="mt-8">
              <Card className="bg-background/50 border-gold/10">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl font-cinzel font-bold mb-4 gold-gradient-text">Select Your Slot</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Choose your position in the rotation cycle. Your slot number determines when you'll receive your full payout. Transparent and fair for all members.
                      </p>
                      <ul className="space-y-3">
                        {["Pick your slot number", "View payout timeline", "Understand your position", "Confirm selection"].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-gold shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card p-8 rounded-2xl">
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Rotation Schedule</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((slot) => (
                            <button
                              key={slot}
                              className={`p-3 rounded-lg font-semibold text-sm transition-all ${
                                slot === 3
                                  ? "bg-gold/20 border-2 border-gold text-gold"
                                  : "bg-white/5 border border-gold/10 text-muted-foreground hover:border-gold/30"
                              }`}
                            >
                              Slot {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Your payout arrives in 6 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step4" className="mt-8">
              <Card className="bg-background/50 border-gold/10">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl font-cinzel font-bold mb-4 gold-gradient-text">Contribute & Receive</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Make your monthly contributions on schedule. Receive real-time notifications for all activities. Receive your full payout when your slot arrives.
                      </p>
                      <ul className="space-y-3">
                        {["Monthly contributions", "Automated tracking", "Payment reminders", "Full payout receipt"].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-gold shrink-0" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card p-8 rounded-2xl">
                      <div className="mb-6">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Your Progress</p>
                        <div className="w-full bg-white/10 rounded-full h-3 border border-gold/20">
                          <div className="bg-gold/50 h-full rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Month 4 of 6 completed</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gold font-semibold">Your next payout: ₦600,000</p>
                        <p className="text-xs text-muted-foreground">Expected in 2 months</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Separator className="bg-gold/10" />

      {/* Analytics Dashboard Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/20 hover:bg-gold/20">Dashboard</Badge>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 gold-gradient-text">Track Your Progress</h2>
            <p className="text-muted-foreground">Real-time analytics and insights into your savings journey.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-background/50 border-gold/10">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>Total savings and active members over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(234,179,8,0.1)" />
                    <XAxis stroke="rgba(255,255,255,0.3)" dataKey="month" />
                    <YAxis stroke="rgba(255,255,255,0.3)" />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(234,179,8,0.2)" }} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#EAB308" strokeWidth={2} name="Savings (₦M)" />
                    <Line type="monotone" dataKey="members" stroke="#6366F1" strokeWidth={2} name="Members" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {[
                { label: "Total in Groups", value: "₦2.4B", change: "+12%" },
                { label: "Active Members", value: "1,200", change: "+45%" },
                { label: "Success Rate", value: "98%", change: "+2%" },
              ].map((stat, i) => (
                <Card key={i} className="bg-background/50 border-gold/10">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-cinzel font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-emerald-400 mt-2 font-semibold">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-gold/10" />

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/20 hover:bg-gold/20">Common Questions</Badge>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 gold-gradient-text">Frequently Asked</h2>
            <p className="text-muted-foreground">Everything you need to know about Rejoice Ajo.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Is my money safe on Rejoice Ajo?",
                a: "Absolutely. Every transaction is verified by our admin team with full audit trail. All funds are held securely and only released according to the group's agreed rotation schedule.",
              },
              {
                q: "How does the rotation system work?",
                a: "Each member gets a slot number that determines their payout order. Everyone contributes equally, and when your slot arrives, you receive the full accumulated pot from all members.",
              },
              {
                q: "What happens if someone doesn't contribute?",
                a: "Our admin team monitors all contributions closely. Non-payment triggers automatic reminders. Persistent non-compliance may result in removal from the group.",
              },
              {
                q: "Can I leave a group early?",
                a: "You can request to leave after receiving your payout, or if there are special circumstances. Contact our support team for assistance with early exit.",
              },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass-card px-6 border-gold/10">
                <AccordionTrigger className="hover:text-gold transition-colors">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Separator className="bg-gold/10" />

      {/* CTA Section */}
      <section className="py-24 px-4 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.05)_0%,transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto glass-card-static p-12 rounded-3xl border border-gold/20">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Ready to Start</p>
          <h2 className="gold-gradient-text text-4xl font-cinzel font-bold mb-4">Join the Rejoice Movement</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-md mx-auto">
            Thousands of Nigerians are already building wealth together. Your financial future starts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-gold px-10 py-4 rounded-xl font-bold inline-flex items-center gap-2 justify-center">
              Create Account <ArrowRight size={18} />
            </Link>
            <Link to="/groups" className="btn-glass px-10 py-4 rounded-xl font-semibold inline-flex items-center gap-2 justify-center">
              Browse Groups <Users size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
