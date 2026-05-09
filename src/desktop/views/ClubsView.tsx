import React from 'react';
import { Card, Badge } from '../components/ui';
import { Users, Calendar } from 'lucide-react';

export function ClubsView() {
  const clubs = [
    { name: 'Computer Club', members: 120, nextEvent: 'Hackathon 2026', type: 'Academic' },
    { name: 'Debate Society', members: 85, nextEvent: 'Inter-Department Debate', type: 'Cultural' },
    { name: 'Robotics Wing', members: 60, nextEvent: 'Line Follower Workshop', type: 'Technical' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Clubs & Extracurriculars</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {clubs.map(club => (
           <Card key={club.name} className="p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8c1515]/10 transition-colors">
                 <Users className="w-8 h-8 text-stone-400 group-hover:text-[#8c1515] transition-colors" />
              </div>
              <Badge variant="outline" className="mb-2 group-hover:border-[#8c1515]/30 group-hover:text-[#8c1515]">{club.type}</Badge>
              <h3 className="font-bold text-lg group-hover:text-[#8c1515] transition-colors">{club.name}</h3>
              <p className="text-sm text-stone-500 mb-4">{club.members} active members</p>
              
              <div className="w-full bg-stone-50 p-3 rounded-lg text-sm text-left mb-4 group-hover:bg-[#8c1515]/5 transition-colors">
                 <div className="text-xs text-stone-400 uppercase font-bold mb-1">Next Event</div>
                 <div className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-[#8c1515]" /> {club.nextEvent}</div>
              </div>
              
              <button className="w-full bg-stone-900 text-white font-bold py-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer pointer-events-none group-hover:bg-[#8c1515]">Join Club</button>
           </Card>
         ))}
      </div>
    </div>
  );
}
