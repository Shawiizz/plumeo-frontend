import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { Divider } from 'primeng/divider';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bannerColor: string;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  bio?: string;
  joinDate: Date;
  isOnline: boolean;
  lastSeen?: Date;
  moments: Moment[];
  stats: UserStats;
}

export interface Moment {
  id: string;
  title: string;
  icon: string;
  color: string;
  date: Date;
  type: 'event' | 'achievement' | 'activity';
}

export interface UserStats {
  postsCount: number;
  likesReceived: number;
  commentsCount: number;
  sharesCount: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Avatar,
    Badge,
    Divider
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  host: {
    'class': 'flex w-full h-full'
  }
})
export class Profile implements OnInit {
  userProfile: UserProfile;
  isOwnProfile = true; // Pour différencier profil personnel vs profil d'un autre utilisateur
  private currentUserId = '1'; // ID de l'utilisateur connecté (mock)

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userProfile = this.generateMockProfile();
  }

  ngOnInit(): void {
    // Vérifie si on regarde le profil d'un autre utilisateur
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      if (userId && userId !== this.currentUserId) {
        this.isOwnProfile = false;
        this.userProfile = this.generateMockProfile(userId);
      } else {
        this.isOwnProfile = true;
        this.userProfile = this.generateMockProfile();
      }
    });
  }

  private generateMockProfile(userId?: string): UserProfile {
    // Si c'est un autre utilisateur, génère des données différentes
    if (userId && userId !== this.currentUserId) {
      return this.generateOtherUserProfile(userId);
    }
    
    // Profil de l'utilisateur connecté
    return {
      id: '1',
      username: 'Shawiiz_z',
      displayName: 'Shawiiz_z',
      avatar: 'S',
      bannerColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      followersCount: 0,
      followingCount: 0,
      friendsCount: 0,
      bio: 'Développeur passionné | Angular & TypeScript enthusiast | Amateur de basket 🏀',
      joinDate: new Date('2023-01-15'),
      isOnline: true,
      moments: [
        {
          id: '1',
          title: 'Soirée de samedi',
          icon: 'pi pi-calendar',
          color: '#f59e0b',
          date: new Date('2025-09-28'),
          type: 'event'
        },
        {
          id: '2',
          title: 'Basket',
          icon: 'pi pi-circle',
          color: '#ef4444',
          date: new Date('2025-09-25'),
          type: 'activity'
        },
        {
          id: '3',
          title: 'Nouveau projet',
          icon: 'pi pi-trophy',
          color: '#8b5cf6',
          date: new Date('2025-09-20'),
          type: 'achievement'
        }
      ],
      stats: {
        postsCount: 42,
        likesReceived: 156,
        commentsCount: 89,
        sharesCount: 23
      }
    };
  }

  onFollowClick(): void {
    // Logic pour follow/unfollow
    console.log('Follow clicked');
  }

  onMessageClick(): void {
    // Redirige vers la messagerie
    this.router.navigate(['/app/messages']);
  }

  private generateOtherUserProfile(userId: string): UserProfile {
    // Génère des profils pour d'autres utilisateurs
    const otherUsers = [
      {
        id: '2',
        username: 'Alex94',
        displayName: 'Alexandre Martin',
        avatar: 'A',
        bio: 'Designer UI/UX passionné | Créateur de belles interfaces 🎨',
        followersCount: 234,
        followingCount: 178,
        friendsCount: 45,
        moments: [
          { id: '1', title: 'Nouveau design', icon: 'pi pi-palette', color: '#ec4899', date: new Date('2025-09-27'), type: 'achievement' as const }
        ]
      },
      {
        id: '3',
        username: 'Marie_L',
        displayName: 'Marie Leroy',
        avatar: 'M',
        bio: 'Photographe professionnelle | Capturer la beauté du monde 📸',
        followersCount: 1250,
        followingCount: 456,
        friendsCount: 89,
        moments: [
          { id: '1', title: 'Exposition photo', icon: 'pi pi-image', color: '#8b5cf6', date: new Date('2025-09-25'), type: 'event' as const }
        ]
      }
    ];

    const userData = otherUsers.find(user => user.id === userId) || otherUsers[0];
    
    return {
      ...userData,
      bannerColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      joinDate: new Date('2023-06-20'),
      isOnline: Math.random() > 0.5,
      lastSeen: new Date(Date.now() - Math.random() * 86400000), // Dernière fois vu dans les 24h
      stats: {
        postsCount: Math.floor(Math.random() * 100) + 20,
        likesReceived: Math.floor(Math.random() * 500) + 100,
        commentsCount: Math.floor(Math.random() * 200) + 50,
        sharesCount: Math.floor(Math.random() * 50) + 10
      }
    };
  }

  onEditProfile(): void {
    // Logic pour éditer le profil
    console.log('Edit profile clicked');
  }

  onAddMoment(): void {
    // Logic pour ajouter un moment
    console.log('Add moment clicked');
  }

  onMomentClick(moment: Moment): void {
    console.log('Moment clicked:', moment);
  }

  formatJoinDate(): string {
    return this.userProfile.joinDate.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }

  getOnlineStatus(): string {
    if (this.userProfile.isOnline) {
      return 'En ligne';
    }
    
    if (this.userProfile.lastSeen) {
      const now = new Date();
      const lastSeen = this.userProfile.lastSeen;
      const diffInHours = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Vu il y a moins d\'une heure';
      } else if (diffInHours < 24) {
        return `Vu il y a ${diffInHours}h`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `Vu il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
      }
    }
    
    return 'Hors ligne';
  }
}